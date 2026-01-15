<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';

	// Canvas reference
	let canvas: HTMLCanvasElement;
	let fullscreenCanvas: HTMLCanvasElement;
	let animationId: number;
	
	// Shape position - using plain object to avoid reactivity issues
	let pos = {
		x: 100,
		y: 100,
		dx: 2,
		dy: 2,
		hue: 0
	};
	
	let speed = $state(3);
	let isFullscreen = $state(false);
	let customImage: HTMLImageElement | null = $state(null);
	let customImageData: string | null = $state(null);

	const shapeSize = 80;
	const shapes = ['dvd', 'circle', 'square', 'diamond', 'custom'] as const;
	type ShapeType = typeof shapes[number];
	let currentShape = $state<ShapeType>('dvd');

	function handleImageUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		// Check file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			alert('Image too large. Please use an image under 5MB.');
			return;
		}

		const reader = new FileReader();
		reader.onload = (event) => {
			const img = new Image();
			img.onload = () => {
				customImage = img;
				customImageData = event.target?.result as string;
				currentShape = 'custom';
			};
			img.src = event.target?.result as string;
		};
		reader.readAsDataURL(file);
	}

	function draw(targetCanvas: HTMLCanvasElement) {
		if (!targetCanvas) return;
		const ctx = targetCanvas.getContext('2d');
		if (!ctx) return;

		// Update canvas size to match container
		const rect = targetCanvas.parentElement?.getBoundingClientRect();
		if (rect) {
			targetCanvas.width = rect.width;
			targetCanvas.height = rect.height;
		}

		// Clear canvas
		ctx.fillStyle = '#1a1a2e';
		ctx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);

		// Move shape
		pos.x += pos.dx * speed;
		pos.y += pos.dy * speed;

		// Bounce off edges and change color
		let bounced = false;
		if (pos.x + shapeSize > targetCanvas.width || pos.x < 0) {
			pos.dx = -pos.dx;
			pos.x = Math.max(0, Math.min(pos.x, targetCanvas.width - shapeSize));
			bounced = true;
		}
		if (pos.y + shapeSize > targetCanvas.height || pos.y < 0) {
			pos.dy = -pos.dy;
			pos.y = Math.max(0, Math.min(pos.y, targetCanvas.height - shapeSize));
			bounced = true;
		}

		if (bounced) {
			pos.hue = (pos.hue + 45) % 360;
		}

		// Draw shape
		ctx.fillStyle = `hsl(${pos.hue}, 70%, 60%)`;
		ctx.shadowColor = `hsl(${pos.hue}, 70%, 50%)`;
		ctx.shadowBlur = 20;

		const centerX = pos.x + shapeSize / 2;
		const centerY = pos.y + shapeSize / 2;

		ctx.beginPath();
		
		if (currentShape === 'custom' && customImage) {
			ctx.shadowBlur = 0;
			ctx.drawImage(customImage, pos.x, pos.y, shapeSize, shapeSize);
		} else if (currentShape === 'circle') {
			ctx.arc(centerX, centerY, shapeSize / 2, 0, Math.PI * 2);
			ctx.fill();
		} else if (currentShape === 'diamond') {
			ctx.moveTo(centerX, pos.y);
			ctx.lineTo(pos.x + shapeSize, centerY);
			ctx.lineTo(centerX, pos.y + shapeSize);
			ctx.lineTo(pos.x, centerY);
			ctx.closePath();
			ctx.fill();
		} else if (currentShape === 'square') {
			ctx.roundRect(pos.x, pos.y, shapeSize, shapeSize, 8);
			ctx.fill();
		} else {
			// DVD logo style
			ctx.font = 'bold 32px system-ui';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.shadowBlur = 15;
			ctx.fillText('DVD', centerX, centerY);
			ctx.font = 'bold 12px system-ui';
			ctx.fillText('VIDEO', centerX, centerY + 20);
		}

		// Draw on both canvases if fullscreen
		if (isFullscreen && fullscreenCanvas && targetCanvas !== fullscreenCanvas) {
			draw(fullscreenCanvas);
		}

		animationId = requestAnimationFrame(() => draw(targetCanvas));
	}

	function enterFullscreen() {
		isFullscreen = true;
	}

	function exitFullscreen() {
		isFullscreen = false;
	}

	// Start animation when canvas is ready
	$effect(() => {
		const activeCanvas = isFullscreen ? fullscreenCanvas : canvas;
		if (activeCanvas) {
			// Initialize position if first time
			const rect = activeCanvas.parentElement?.getBoundingClientRect();
			if (rect && pos.x === 100 && pos.y === 100) {
				pos.x = Math.random() * (rect.width - shapeSize);
				pos.y = Math.random() * (rect.height - shapeSize);
			}
			
			if (animationId) cancelAnimationFrame(animationId);
			draw(activeCanvas);
		}
		return () => {
			if (animationId) cancelAnimationFrame(animationId);
		};
	});
</script>

<ToolWrapper
	title="Zen Motion"
	description="Nostalgic bouncing shape for eye rest. Pure visual calm."
>
	<div class="flex flex-col gap-4">
		<!-- Controls -->
		<div class="flex flex-wrap items-center gap-4 justify-between">
			<div class="flex gap-2 flex-wrap">
				{#each shapes as shape}
					{#if shape !== 'custom' || customImage}
						<button
							class="btn btn-sm {currentShape === shape ? 'btn-primary' : 'btn-ghost'}"
							onclick={() => currentShape = shape}
						>
							{shape === 'dvd' ? 'DVD' : shape.charAt(0).toUpperCase() + shape.slice(1)}
						</button>
					{/if}
				{/each}
				<label class="btn btn-sm btn-ghost">
					📁 Upload
					<input type="file" accept="image/*" class="hidden" onchange={handleImageUpload} />
				</label>
			</div>
			
			<div class="flex items-center gap-3">
				<span class="text-sm text-base-content/60">Speed</span>
				<input
					type="range"
					min="1"
					max="8"
					step="0.5"
					bind:value={speed}
					class="range range-sm w-24"
				/>
				<button class="btn btn-sm btn-ghost gap-1" onclick={enterFullscreen}>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
					</svg>
					Fullscreen
				</button>
			</div>
		</div>

		<!-- Canvas Container -->
		<div class="relative w-full rounded-2xl overflow-hidden" style="height: 60vh; min-height: 400px;">
			<canvas bind:this={canvas} class="w-full h-full"></canvas>
		</div>

		<!-- Tip -->
		<p class="text-sm text-base-content/50 text-center">
			Watch the shape bounce and change colors. Perfect for resting your eyes.
		</p>
	</div>
</ToolWrapper>

<!-- Fullscreen Mode -->
<FullscreenOverlay isFullscreen={isFullscreen} onExit={exitFullscreen}>
	{#snippet children()}
		<canvas bind:this={fullscreenCanvas} class="w-full h-full"></canvas>
	{/snippet}

	{#snippet controls()}
		{#each shapes as shape}
			{#if shape !== 'custom' || customImage}
				<button
					class="btn btn-sm {currentShape === shape ? 'btn-primary' : 'btn-ghost bg-black/50 text-white'}"
					onclick={() => currentShape = shape}
				>
					{shape === 'dvd' ? 'DVD' : shape.charAt(0).toUpperCase() + shape.slice(1)}
				</button>
			{/if}
		{/each}
		<input
			type="range"
			min="1"
			max="8"
			step="0.5"
			bind:value={speed}
			class="range range-xs w-20"
		/>
	{/snippet}
</FullscreenOverlay>
