import { Scene, CustomProceduralTexture, Effect, Color3, Vector2} from "@babylonjs/core";

// 用于构建各种流动的纹理动画
export class ThingsCommonPipeFlowTexture {
  private readonly name: string;
  private readonly size: number;
  private readonly scene: Scene;

  // 名称，个数，场景
  constructor(name: string, size: number, scene: Scene) {
    this.name = name;
    this.size = size;
    this.scene = scene;
    // 注入gles脚本
    Effect.ShadersStore['ThingsPipeFlowPixelShader'] = commonFlowGlES;
  }

  public buildFire(){
    let fireFlowTexture = new CustomProceduralTexture(this.name, 'ThingsPipeFlow', this.size, this.scene);
    fireFlowTexture.setFloat("time", 0.0);
    fireFlowTexture.setVector2("speed", new Vector2(-0.5, -0.2));
    fireFlowTexture.setFloat("alphaThreshold", 0.5);
    fireFlowTexture.setColor3("c1", this.retRedFireColors()[0]);
    fireFlowTexture.setColor3("c2", this.retRedFireColors()[1]);
    fireFlowTexture.setColor3("c3", this.retRedFireColors()[2]);
    fireFlowTexture.setColor3("c4", this.retRedFireColors()[3]);
    fireFlowTexture.setColor3("c5", this.retRedFireColors()[4]);
    fireFlowTexture.setColor3("c6", this.retRedFireColors()[5]);
    return fireFlowTexture;
  }

  public buildWater(){
    let fireFlowTexture = new CustomProceduralTexture(this.name, 'ThingsPipeFlow', this.size, this.scene);
    fireFlowTexture.setFloat("time", 0.0);
    fireFlowTexture.setVector2("speed", new Vector2(0.7, 0.9));
    fireFlowTexture.setFloat("alphaThreshold", 0.5);
    fireFlowTexture.setColor3("c1", this.waterFlowColors()[0]);
    fireFlowTexture.setColor3("c2", this.waterFlowColors()[1]);
    fireFlowTexture.setColor3("c3", this.waterFlowColors()[2]);
    fireFlowTexture.setColor3("c4", this.waterFlowColors()[3]);
    fireFlowTexture.setColor3("c5", this.waterFlowColors()[4]);
    fireFlowTexture.setColor3("c6", this.waterFlowColors()[5]);
    return fireFlowTexture;
  }


  // 火焰纹理流动效果，第二个颜色决定了主色
  retRedFireColors(): Color3[] {
    return [new Color3(0.5, 0.0, 0.1), new Color3(0.9, 0.0, 0.0), new Color3(0.2, 0.0, 0.0), new Color3(1.0, 0.9, 0.0), new Color3(0.1, 0.1, 0.1), new Color3(0.9, 0.9, 0.9)];
  }

  // 水管流动效果
  waterFlowColors(): Color3[] {
    return [new Color3(0.1, 0, 0.8), new Color3(0.2, 0.6, 0.9), new Color3(0.2, 0.3, 0.9), new Color3(0.3, 0.5, 0.9), new Color3(0.1, 0.1, 0.1), new Color3(0.9, 0.9, 0.9)];
  }
}


// 通用的流动性gles脚本，设置不同的颜色，显示火焰,水流,烟雾等效果
const commonFlowGlES = `
    #ifdef GL_ES
    precision highp float;
    #endif

    // 传入的变量
    uniform float time;
    uniform vec3 c1;
    uniform vec3 c2;
    uniform vec3 c3;
    uniform vec3 c4;
    uniform vec3 c5;
    uniform vec3 c6;
    uniform vec2 speed;
    uniform float shift;
    uniform float alphaThreshold;

    varying vec2 vUV;   // 上个着色器传入

    float rand(vec2 n) {
        return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }
    
    float noise(vec2 n) {
        const vec2 d = vec2(0.0, 1.0);
        vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
        return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
    }
    
    float fbm(vec2 n) {
        float total = 0.0, amplitude = 1.0;
        for (int i = 0; i < 4; i++) {
            total += noise(n) * amplitude;
            n += n;
            amplitude *= 0.5;
        }
        return total;
    }

    void main() {
        vec2 p = vUV * 8.0;
        float q = fbm(p - time * 0.1);
        vec2 r = vec2(fbm(p + q + time * speed.x - p.x - p.y), fbm(p + q - time * speed.y));
        vec3 c = mix(c1, c2, fbm(p + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);
        vec3 color = c * cos(shift * -vUV.y);
        float luminance = dot(color.rgb, vec3(0.3, 0.59, 0.11));
    
        gl_FragColor = vec4(color, luminance * alphaThreshold + (1.0 - alphaThreshold));
    }
`;
