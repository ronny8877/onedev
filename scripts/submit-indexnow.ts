
import { BASE_URL } from '../src/lib/config/tools';
import { getIndexableAbsoluteUrls } from '../src/lib/config/indexing';

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
// Remove protocol to get host (e.g., https://onedev.tools -> onedev.tools)
const HOST = new URL(BASE_URL).host;

async function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    
    // Get API key from args (looking for a simple string not starting with -) or ENV
    let apiKey = process.env.INDEXNOW_KEY;
    const keyArg = args.find(arg => !arg.startsWith('-'));
    if (keyArg) {
        apiKey = keyArg;
    }

    if (!apiKey && !dryRun) {
        console.error('Error: IndexNow API Key is required. Set INDEXNOW_KEY env var or pass it as an argument.');
        console.error('Usage: npx tsx scripts/submit-indexnow.ts <api-key> [--dry-run]');
        process.exit(1);
    }

    console.log(`\n🚀 Preparing IndexNow submission for ${HOST}...`);

    const urls = getIndexableAbsoluteUrls(BASE_URL);

    console.log(`Found ${urls.length} URLs to submit.`);

    // 2. Prepare Payload
    const payload = {
        host: HOST,
        key: apiKey,
        urlList: urls,
        // keyLocation: `https://${HOST}/${apiKey}.txt` // Optional: if we want to specify where the key is
    };

    // 3. Dry Run or Execute
    if (dryRun) {
        console.log('\n[DRY RUN] Would submit the following payload:');
        console.log(JSON.stringify(payload, null, 2));
        console.log('\n✅ Dry run complete. No data sent.');
        return;
    }

    // 4. Submit
    try {
        console.log(`\nSubmitting to ${INDEXNOW_ENDPOINT}...`);
        const response = await fetch(INDEXNOW_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log('✅ Success! URLs submitted to IndexNow.');
            console.log(`Status: ${response.status} ${response.statusText}`);
        } else {
            console.error('❌ Failed to submit URLs.');
            console.error(`Status: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error('Response:', text);
        }
    } catch (error) {
        console.error('❌ Network or script error:', error);
    }
}

main();
