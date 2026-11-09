import { Component, HostListener, OnDestroy, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { inject } from '@angular/core';
import { BIRTHDAY_UNLOCK_AT, BirthdayCountdownComponent } from './features/countdown/birthday-countdown.component';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, BirthdayCountdownComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnDestroy {
  protected readonly unlocked = signal(Date.now() >= BIRTHDAY_UNLOCK_AT);
  protected readonly router = inject(Router);
  protected navHidden = false;
  private lastScrollY = 0;
  private revealTimer?: number;

  protected openBirthdaySurprise(): void {
    this.unlocked.set(true);
  }

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    const currentScrollY = window.scrollY;
    if (currentScrollY < 12 || currentScrollY < this.lastScrollY) {
      this.navHidden = false;
      this.scheduleNavHide();
    } else if (currentScrollY > this.lastScrollY + 4) {
      this.navHidden = true;
      this.clearNavTimer();
    }
    this.lastScrollY = currentScrollY;
  }

  private scheduleNavHide(): void {
    this.clearNavTimer();
    this.revealTimer = window.setTimeout(() => {
      if (window.scrollY > 12) this.navHidden = true;
    }, 1800);
  }

  private clearNavTimer(): void {
    if (this.revealTimer !== undefined) window.clearTimeout(this.revealTimer);
    this.revealTimer = undefined;
  }

  ngOnDestroy(): void {
    this.clearNavTimer();
  }
}
