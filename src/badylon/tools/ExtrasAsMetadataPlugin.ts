import {IGLTFLoaderExtension} from "@babylonjs/loaders";
import {GLTFLoader, ICamera, IMaterial, INode} from "@babylonjs/loaders/glTF/2.0";
import {Camera, Material, TransformNode} from "@babylonjs/core";
import {IMesh, IMeshPrimitive} from "@babylonjs/loaders/glTF/2.0/glTFLoaderInterfaces";
import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh";
import {Nullable} from "@babylonjs/core/types";

const NAME = "ExtrasAsMetadataPlugin";

interface ObjectWithMetadata {
  metadata: any;
}

export class ExtrasAsMetadataPlugin implements IGLTFLoaderExtension {

  /**
   * The name of this extension.
   */
  public readonly name = NAME;

  /**
   * Defines whether this extension is enabled.
   */
  public enabled = true;

  private readonly _loader: GLTFLoader;

  private static _assignExtras(
    babylonObject: ObjectWithMetadata,
    gltfProp: any
  ): void {
    if (gltfProp.extras && Object.keys(gltfProp.extras).length > 0) {
      const metadata = (babylonObject.metadata = babylonObject.metadata || {});
      const gltf = (metadata.gltf = metadata.gltf || {});
      gltf.extras = gltfProp.extras;
    }
  }

  /** @hidden */
  public constructor(loader: GLTFLoader) {
    this._loader = loader;
  }

  /** @hidden */
  public dispose(): void {
    (this._loader as any) = null;
  }

  /** @hidden */
  public loadNodeAsync(
    context: string,
    node: INode,
    assign: (babylonTransformNode: TransformNode) => void
  ): Nullable<Promise<TransformNode>> {
    return this._loader.loadNodeAsync(
      context,
      node,
      (babylonTransformNode): void => {
        ExtrasAsMetadataPlugin._assignExtras(babylonTransformNode, node);
        assign(babylonTransformNode);
      }
    );
  }

  /** @hidden */
  public loadCameraAsync(
    context: string,
    camera: ICamera,
    assign: (babylonCamera: Camera) => void
  ): Nullable<Promise<Camera>> {
    return this._loader.loadCameraAsync(
      context,
      camera,
      (babylonCamera): void => {
        ExtrasAsMetadataPlugin._assignExtras(babylonCamera, camera);
        assign(babylonCamera);
      }
    );
  }

  public loadMeshPrimitiveAsync(context: string, name: string,
                                 node: INode, mesh: IMesh,
                                 primitive: IMeshPrimitive,
                                 assign: (babylonMesh: AbstractMesh) => void): Nullable<Promise<AbstractMesh>>{
    return this._loader._loadMeshPrimitiveAsync(context, name, node, mesh, primitive,
      (babylonMesh):void => {
      ExtrasAsMetadataPlugin._assignExtras(babylonMesh, mesh);
      assign(babylonMesh);
    })
  };



  /** @hidden */
  public createMaterial(
    context: string,
    material: IMaterial,
    babylonDrawMode: number
  ): Nullable<Material> {
    const babylonMaterial = this._loader.createMaterial(
      context,
      material,
      babylonDrawMode
    );
    ExtrasAsMetadataPlugin._assignExtras(babylonMaterial, material);
    return babylonMaterial;
  }
}

export function registerLoaderPlugin(){
  GLTFLoader.RegisterExtension(NAME, function(loader){ return new ExtrasAsMetadataPlugin(loader)});
}

