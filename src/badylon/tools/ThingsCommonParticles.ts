import {Scene, ParticleSystem, Texture, Color4, Vector3, float} from '@babylonjs/core';

// 通用的烟雾，火焰粒子系统
export class ThingsCommonParticles{
  private readonly name: string;
  private readonly capacity: number;
  private readonly scene:Scene;
  private readonly emitter: any;

  constructor(name:string, capacity: number, emitter:any, scene:Scene){
    this.name = name;
    this.capacity = capacity;
    this.emitter = emitter;
    this.scene = scene;
  }

  // 喷火焰发射器
  public buildParticle(opts: CommonParticlesOptions){
    let particleSystem = new ParticleSystem(this.name, this.capacity, this.scene);
    //Texture of each particle
    particleSystem.particleTexture = new Texture("textures/flare.png", this.scene);
    // Where the particles come from
    particleSystem.emitter = this.emitter; // the starting object, the emitter
    // BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;
    // Angular speed, in radians
    particleSystem.minAngularSpeed = 0.1;
    particleSystem.maxAngularSpeed = Math.PI;

    if(opts.particleMode === CommonParticlesType.FIRE_MODE){
      particleSystem.color1 = new Color4(1, 0.5, 0, 1.0);
      particleSystem.color2 = new Color4(1, 0.5, 0, 1.0);
      particleSystem.colorDead = new Color4(0, 0, 0, 0.0);
    }else if(opts.particleMode === CommonParticlesType.SMOKE_MODE){
      particleSystem.color1 = new Color4(0.1, 0.1, 0.1, 1.0);
      particleSystem.color2 = new Color4(0.1, 0.1, 0.1, 1.0);
      particleSystem.colorDead = new Color4(0, 0, 0, 0.0);
    }

    particleSystem.minEmitBox = opts.minEmitterBox;
    particleSystem.maxEmitBox = opts.maxEmitterBox;

    // Size of each particle (random between...
    particleSystem.minSize = opts.particleMinSize;
    particleSystem.maxSize = opts.particleMaxSize;

    // Life time of each particle (random between...
    particleSystem.minLifeTime = opts.particleMinLifeTime;
    particleSystem.maxLifeTime = opts.particleMaxLifeTime;
    particleSystem.emitRate = opts.particleEmitterRate;

    // Set the gravity of all particles
    particleSystem.gravity = new Vector3(0, 0, 0);

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = opts.direction1;
    particleSystem.direction2 = opts.direction2;

    // Speed
    particleSystem.minEmitPower = opts.minEmitPower;
    particleSystem.maxEmitPower = opts.maxEmitPower;
    particleSystem.updateSpeed = opts.updateSpeed;

    // Start the particle system
    // particleSystem.start();
    return particleSystem;
  }
}

// 粒子系统的选项
export enum CommonParticlesType{
  FIRE_MODE = 'FIRE',
  SMOKE_MODE = 'SMOKE',
}

// 粒子系统的选项
export interface CommonParticlesOptions{

  particleMode: CommonParticlesType,

  // 粒子系统发射器开始的最小尺寸
  minEmitterBox:Vector3,
  // 粒子系统发射器开始的最大尺寸
  maxEmitterBox:Vector3,

  // 粒子的大小
  particleMinSize: float,
  particleMaxSize: float,
  // 粒子存活时长
  particleMinLifeTime: float,
  particleMaxLifeTime: float,

  // 粒子发射的频率
  particleEmitterRate: number,

  // 粒子系统的默认重量，默认为0,0,0, 主要用于粒子的重力下降(喷泉)，碰撞等场景
  particleSystemGravity: Vector3,

  // 粒子运行的方向
  direction1:Vector3,
  direction2:Vector3,
  // 发射的力量
  minEmitPower: number,
  maxEmitPower: number,

  // 动画更新速度
  updateSpeed: float,
}
