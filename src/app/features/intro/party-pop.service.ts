import { Injectable, OnDestroy } from '@angular/core';

@Injectable()
export class PartyPopService implements OnDestroy {
  private context?: AudioContext;

  prepare(): void {
    if (!window.AudioContext) return;
    try {
      this.context ??= new AudioContext();
      if (this.context.state === 'suspended') void this.context.resume().catch(() => undefined);
    } catch {
      this.context = undefined;
    }
  }

  async play(): Promise<void> {
    const context = this.context;
    if (!context || context.state !== 'running') return;

    const duration = .45;
    const source = context.createBufferSource();
    const gain = context.createGain();
    const now = context.currentTime;
    source.buffer = this.createPopBuffer(context, duration);
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(.32, now + .003);
    gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
    source.connect(gain);
    gain.connect(context.destination);
    await new Promise<void>((resolve) => {
      source.onended = () => resolve();
      source.start(now);
      source.stop(now + duration);
    });
  }

  private createPopBuffer(context: AudioContext, duration: number): AudioBuffer {
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let index = 0; index < samples.length; index += 1) {
      const time = index / context.sampleRate;
      const burst = Math.exp(-time * 35);
      const crackle = .12 * Math.exp(-time * 7);
      const noise = Math.random() * 2 - 1;
      const thump = Math.sin(2 * Math.PI * 130 * time) * Math.exp(-time * 55);
      samples[index] = noise * (burst * .75 + crackle) + thump * .25;
    }
    return buffer;
  }

  ngOnDestroy(): void {
    void this.context?.close();
    this.context = undefined;
  }
}
