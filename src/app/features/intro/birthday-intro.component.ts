import { ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import { BirthdayCelebrationComponent } from './birthday-celebration.component';
import { FlowerBouquetComponent } from './flower-bouquet.component';
import { PartyPopService } from './party-pop.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-birthday-intro',
  imports: [BirthdayCelebrationComponent, FlowerBouquetComponent],
  providers: [PartyPopService],
  templateUrl: './birthday-intro.component.html',
})
export class BirthdayIntroComponent implements OnDestroy {
  protected celebrating = false;
  protected candleTwoLit = true;
  protected candleZeroLit = true;
  protected listening = false;
  protected startingMicrophone = false;
  protected statusMessage = "allow the microphone, then blow to make a wish";
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly partyPop = inject(PartyPopService);
  private microphoneContext?: AudioContext;
  private microphone?: MediaStream;
  private analyser?: AnalyserNode;
  private audioFrame?: number;
  private noiseFloor = 0;
  private calibrationSamples = 0;
  private calibrationStartedAt = 0;
  private blowStartedAt = 0;
  private destroyed = false;
  private swipeStartY = 0;
  private swipeStartX = 0;
  private isBlowing = false;

  protected startBlowGesture(event: PointerEvent): void {
    this.partyPop.prepare();
    this.swipeStartY = event.clientY;
    this.swipeStartX = event.clientX;
    this.isBlowing = true;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  protected moveBlowGesture(event: PointerEvent): void {
    if (!this.isBlowing) return;
    const upwardDistance = this.swipeStartY - event.clientY;
    const horizontalDistance = Math.abs(this.swipeStartX - event.clientX);
    if (upwardDistance > 48 && upwardDistance > horizontalDistance) this.extinguishCandles();
  }

  protected endBlowGesture(): void {
    this.isBlowing = false;
  }

  protected toggleCandle(digit: 2 | 0): void {
    this.partyPop.prepare();
    if (digit === 2 && this.candleTwoLit) {
      this.candleTwoLit = false;
    } else if (digit === 0 && this.candleZeroLit) {
      this.candleZeroLit = false;
    } else if (digit === 2) {
      this.candleTwoLit = true;
    } else {
      this.candleZeroLit = true;
    }
    this.updateWishMessage();
    if (!this.candleTwoLit && !this.candleZeroLit) this.celebrate();
  }

  private updateWishMessage(): void {
    if (!this.candleTwoLit && !this.candleZeroLit) {
      this.statusMessage = 'Happy birthday, my love!';
      return;
    }
    this.statusMessage = !this.candleTwoLit && this.candleZeroLit
      ? 'One more wish - blow out the zero'
      : 'Make a wish, then blow out the candles';
  }
  protected async startListening(): Promise<void> {
    if (this.startingMicrophone || this.listening) return;
    this.partyPop.prepare();
    if (!navigator.mediaDevices?.getUserMedia || !window.AudioContext) {
      this.statusMessage = 'microphone unavailable - tap the candle to make a wish';
      return;
    }
    this.startingMicrophone = true;
    this.statusMessage = 'Allow microphone access to make a wish';
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      if (this.destroyed) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      this.microphone = stream;
      const microphoneContext = new AudioContext();
      this.microphoneContext = microphoneContext;
      await microphoneContext.resume();
      if (this.destroyed) return;
      const source = microphoneContext.createMediaStreamSource(this.microphone);
      this.analyser = microphoneContext.createAnalyser();
      this.analyser.fftSize = 1024;
      source.connect(this.analyser);
      this.noiseFloor = 0;
      this.calibrationSamples = 0;
      this.calibrationStartedAt = performance.now();
      this.blowStartedAt = 0;
      this.listening = true;
      this.statusMessage = 'Ready in a moment...';
      this.detectBlow();
    } catch {
      this.stopListening();
      this.statusMessage = 'microphone permission unavailable - tap the candle to make a wish';
    } finally {
      this.startingMicrophone = false;
      if (!this.destroyed) this.changeDetector.markForCheck();
    }
  }

  private detectBlow(): void {
    if (!this.analyser || !this.listening) return;
    const samples = new Uint8Array(this.analyser.fftSize);
    this.analyser.getByteTimeDomainData(samples);
    const rms = this.calculateRms(samples);
    const elapsed = performance.now() - this.calibrationStartedAt;
    if (elapsed < 700) {
      this.calibrationSamples += 1;
      this.noiseFloor += (rms - this.noiseFloor) / this.calibrationSamples;
    }
    if (elapsed >= 700 && this.statusMessage === 'Ready in a moment...') {
      this.statusMessage = 'Blow toward your microphone to make a wish';
      this.changeDetector.markForCheck();
    }
    const isBlow = elapsed >= 700 && rms > Math.max(0.008, this.noiseFloor * 1.5);
    this.blowStartedAt = isBlow ? this.blowStartedAt || performance.now() : 0;
    if (this.blowStartedAt && performance.now() - this.blowStartedAt > 110) {
      this.extinguishCandles();
      if (!this.listening) return;
    }
    this.audioFrame = requestAnimationFrame(() => this.detectBlow());
  }

  private calculateRms(samples: Uint8Array): number {
    let sum = 0;
    for (const sample of samples) {
      const normalized = (sample - 128) / 128;
      sum += normalized * normalized;
    }
    return Math.sqrt(sum / samples.length);
  }

  private extinguishCandles(): void {
    this.blowStartedAt = 0;
    if (this.candleTwoLit) {
      this.candleTwoLit = false;
    } else if (this.candleZeroLit) {
      this.candleZeroLit = false;
    }
    this.isBlowing = false;
    this.updateWishMessage();
    if (!this.candleTwoLit && !this.candleZeroLit) this.celebrate();
    this.changeDetector.markForCheck();
  }

  private celebrate(): void {
    this.stopListening();
    if (this.celebrating) return;
    this.celebrating = true;
  }

  protected openThingsILove(): void {
    void this.router.navigateByUrl('/things-i-love');
  }
  private stopListening(): void {
    this.listening = false;
    if (this.audioFrame !== undefined) cancelAnimationFrame(this.audioFrame);
    this.audioFrame = undefined;
    this.microphone?.getTracks().forEach((track) => track.stop());
    this.microphone = undefined;
    this.analyser = undefined;
    this.microphoneContext?.close();
    this.microphoneContext = undefined;
  }
  ngOnDestroy(): void {
    this.destroyed = true;
    this.stopListening();
  }
}
