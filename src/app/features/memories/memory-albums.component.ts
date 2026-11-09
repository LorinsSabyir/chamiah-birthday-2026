import { AfterViewInit, ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MEMORIES, type Memory } from './memory-decks';

@Component({
  selector: 'app-memory-albums',
  templateUrl: './memory-albums.component.html',
})
export class MemoryAlbumsComponent implements AfterViewInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  protected readonly pageTitle: string = this.route.snapshot.data['deckTitle'] ?? 'Our memories';
  protected readonly pageSubtitle: string = this.route.snapshot.data['deckSubtitle'] ?? '';
  protected readonly memories: Memory[] = (this.route.snapshot.data['cards'] as Memory[] | undefined) ?? MEMORIES;

  protected activeIndex = 0;
  protected isFlipped = false;
  protected isDragging = false;
  protected isResetting = false;
  protected dragOffset = 0;
  protected swipeDirection: 'next' | 'previous' | '' = '';
  private readonly changeDetector = inject(ChangeDetectorRef);
  private dragStartX = 0;
  private dragStartY = 0;
  private hasDragged = false;
  private suppressClick = false;
  private swipeTimer?: number;
  private resetFrame?: number;

  protected get activeMemory() {
    return this.memories[this.activeIndex];
  }

  protected get nextMemory() {
    return this.memories[(this.activeIndex + 1) % this.memories.length];
  }

  protected get secondNextMemory() {
    return this.memories[(this.activeIndex + 2) % this.memories.length];
  }

  protected get previousMemory() {
    return this.memories[(this.activeIndex - 1 + this.memories.length) % this.memories.length];
  }

  ngAfterViewInit(): void {
    for (const memory of this.memories) {
      const image = new Image();
      image.src = memory.image;
    }
  }

  protected goNext(): void {
    this.activeIndex = (this.activeIndex + 1) % this.memories.length;
  }

  protected goPrevious(): void {
    this.activeIndex = (this.activeIndex - 1 + this.memories.length) % this.memories.length;
  }

  protected onPointerDown(event: PointerEvent): void {
    if (this.swipeDirection || this.isResetting) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.dragOffset = 0;
    this.hasDragged = false;
    this.suppressClick = false;
    this.isDragging = true;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.isDragging) return;
    const deltaX = event.clientX - this.dragStartX;
    const deltaY = event.clientY - this.dragStartY;
    if (!this.hasDragged && Math.abs(deltaX) < 7 && Math.abs(deltaY) < 7) return;
    if (!this.hasDragged && Math.abs(deltaY) > Math.abs(deltaX)) {
      this.isDragging = false;
      this.suppressClick = true;
      return;
    }
    this.hasDragged = true;
    this.dragOffset = deltaX;
  }

  protected onPointerUp(): void {
    if (!this.isDragging) return;
    const offset = this.dragOffset;
    this.isDragging = false;
    if (!this.hasDragged || Math.abs(offset) < 90) {
      this.dragOffset = 0;
      this.suppressClick = this.hasDragged;
      return;
    }
    this.startSwipe(offset > 0 ? 'next' : 'previous', offset);
    this.suppressClick = true;
  }

  private startSwipe(direction: 'next' | 'previous', offset: number): void {
    if (this.swipeDirection) return;
    this.dragOffset = offset;
    this.swipeDirection = direction;
    this.swipeTimer = window.setTimeout(() => {
      this.isResetting = true;
      if (direction === 'next') this.goNext();
      else this.goPrevious();
      this.isFlipped = false;
      this.swipeDirection = '';
      this.dragOffset = 0;
      this.hasDragged = false;
      this.changeDetector.markForCheck();
      this.resetFrame = requestAnimationFrame(() => {
        this.resetFrame = requestAnimationFrame(() => {
          this.isResetting = false;
          this.resetFrame = undefined;
          this.changeDetector.markForCheck();
        });
      });
    }, 340);
  }

  protected onPointerCancel(): void {
    this.isDragging = false;
    this.dragOffset = 0;
    this.hasDragged = false;
  }

  protected flipCard(): void {
    if (this.suppressClick || this.swipeDirection) {
      this.suppressClick = false;
      return;
    }
    this.isFlipped = !this.isFlipped;
  }

  ngOnDestroy(): void {
    if (this.swipeTimer !== undefined) window.clearTimeout(this.swipeTimer);
    if (this.resetFrame !== undefined) cancelAnimationFrame(this.resetFrame);
  }

}
