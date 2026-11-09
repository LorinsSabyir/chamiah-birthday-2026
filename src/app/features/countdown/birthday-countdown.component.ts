import { Component, computed, EventEmitter, OnDestroy, OnInit, Output, signal } from '@angular/core';

export const BIRTHDAY_UNLOCK_AT = Date.parse('2026-11-10T00:00:00+08:00');

@Component({
  selector: 'app-birthday-countdown',
  templateUrl: './birthday-countdown.component.html',
  styleUrl: './birthday-countdown.component.css',
})
export class BirthdayCountdownComponent implements OnInit, OnDestroy {
  @Output() readonly unlocked = new EventEmitter<void>();
  protected readonly remainingSeconds = signal(this.getRemainingSeconds());
  protected readonly days = computed(() => Math.floor(this.remainingSeconds() / 86400));
  protected readonly hours = computed(() => Math.floor(this.remainingSeconds() / 3600) % 24);
  protected readonly minutes = computed(() => Math.floor(this.remainingSeconds() / 60) % 60);
  protected readonly seconds = computed(() => this.remainingSeconds() % 60);
  private timer?: number;

  ngOnInit(): void {
    if (this.remainingSeconds() === 0) {
      this.unlocked.emit();
      return;
    }
    this.timer = window.setInterval(() => this.updateCountdown(), 1000);
  }

  protected formatUnit(value: number): string {
    return String(value).padStart(2, '0');
  }

  private getRemainingSeconds(): number {
    return Math.max(0, Math.ceil((BIRTHDAY_UNLOCK_AT - Date.now()) / 1000));
  }

  private updateCountdown(): void {
    const remaining = this.getRemainingSeconds();
    this.remainingSeconds.set(remaining);
    if (remaining === 0) {
      this.stopTimer();
      this.unlocked.emit();
    }
  }

  private stopTimer(): void {
    if (this.timer !== undefined) window.clearInterval(this.timer);
    this.timer = undefined;
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }
}
