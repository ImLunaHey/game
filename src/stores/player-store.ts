import { createRef } from 'react';
import { makeAutoObservable } from 'mobx';

type Direction = 'up' | 'down' | 'left' | 'right';

class PlayerStore {
  private _ref = createRef<HTMLDivElement>();
  private _locked = false;
  private _x = 0;
  private _y = 0;
  private _direction: Direction = 'down';
  private _hasSpawned = false;

  constructor() {
    makeAutoObservable(this);
  }

  public getRef() {
    return this._ref;
  }

  public lockPlayer() {
    this._locked = true;
  }

  public unlockPlayer() {
    this._locked = false;
  }

  public get isPlayerLocked() {
    return this._locked;
  }

  public get x() {
    return this._x;
  }

  public get y() {
    return this._y;
  }

  public set x(x: number) {
    this._hasSpawned = true;
    this._x = x;
  }

  public set y(y: number) {
    this._hasSpawned = true;
    this._y = y;
  }

  public get hasSpawned() {
    return this._hasSpawned;
  }

  public get direction() {
    return this._direction;
  }

  public set direction(direction: Direction) {
    this._direction = direction;
  }
}

export const playerStore = new PlayerStore();
