import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, inject, OnDestroy, Output } from '@angular/core';
import { PartyPopService } from './party-pop.service';

@Component({
  selector: 'app-birthday-celebration',
  templateUrl: './birthday-celebration.component.html',
  styleUrl: './birthday-celebration.component.css',
})
export class BirthdayCelebrationComponent implements AfterViewInit, OnDestroy {
  @Output() readonly finished = new EventEmitter<void>();
  protected audioUnavailable = false;
  protected autoplayBlocked = false;
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly partyPop = inject(PartyPopService);
  private audio?: HTMLAudioElement;
  private completed = false;
  protected readonly confetti = Array.from({ length: 48 }, (_, index) => ({
    left: (index * 37 + 7) % 100,
    delay: (index % 12) * 130,
    duration: 2400 + (index % 5) * 300,
    color: ['#f16b96', '#ffd36e', '#b69ced', '#f9aabd', '#9bd9c8'][index % 5],
  }));

  ngAfterViewInit(): void {
    this.audio = new Audio('Happy_Birthday_to_You.mp3');
    this.audio.addEventListener('ended', this.finishCelebration);
    this.audio.addEventListener('error', this.handleAudioError);
    void this.playCelebrationAudio();
  }

  private async playCelebrationAudio(): Promise<void> {
    try {
      await this.partyPop.play();
    } catch {
      // Continue to the birthday song if the sound effect cannot play.
    } finally {
      if (!this.completed) this.playSong();
    }
  }

  protected playSong(): void {
    if (!this.audio || this.completed) return;
    void this.audio.play().then(() => {
      if (this.completed) return;
      this.autoplayBlocked = false;
      this.changeDetector.markForCheck();
    }).catch((error: unknown) => {
      if (this.completed) return;
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        this.autoplayBlocked = true;
      } else {
        this.audioUnavailable = true;
      }
      this.changeDetector.markForCheck();
    });
  }

  protected continueToNextPage(): void {
    this.finishCelebration();
  }

  private readonly handleAudioError = (): void => {
    if (this.completed) return;
    this.audioUnavailable = true;
    this.autoplayBlocked = false;
    this.changeDetector.markForCheck();
  };

  private readonly finishCelebration = (): void => {
    if (this.completed) return;
    this.completed = true;
    this.audio?.pause();
    this.finished.emit();
  };

  ngOnDestroy(): void {
    this.completed = true;
    if (this.audio) {
      this.audio.pause();
      this.audio.removeEventListener('ended', this.finishCelebration);
      this.audio.removeEventListener('error', this.handleAudioError);
    }
  }
}
