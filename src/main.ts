import * as BABYLON from 'babylonjs';
import { AbstractMesh, Vector3 } from 'babylonjs';
import 'babylonjs-loaders';

// キャンバス
let canvas = <HTMLCanvasElement>document.getElementById("renderCanvas")
// エンジン
let engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true
})

// シーンを作成する
function createScene() {
    let scene = new BABYLON.Scene(engine)

    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 0.84, Math.PI/2.4,
     -20, new BABYLON.Vector3(0,0,0), scene);
    camera.attachControl(canvas, true);

    let posL = new BABYLON.Vector3(0, 1, 0)
    new BABYLON.HemisphericLight('light', posL, scene)


    BABYLON.SceneLoader.ImportMesh("", "./", "simplebrush.glb", scene, (meshes) => {
        // メッシュのクローン
        cloneMesh(meshes)

        // スケルトンのアニメーション
        let skeleton = meshes[1].skeleton!
        if (skeleton == null) {
            return
        }
        
        let index = 4
        console.log("skeleton.bones.length")
        console.log(skeleton.bones.length)
        if (skeleton.bones.length <= index) {
            return
        }
        let bone = skeleton.bones[index]

        var trasformNode = bone.getTransformNode();
        if (trasformNode == null || trasformNode.rotationQuaternion == null) {
            return
        }

        var angle = 0;
        scene.registerBeforeRender(function () {
            BABYLON.Quaternion.FromEulerAnglesToRef(0, angle, 0, trasformNode!!.rotationQuaternion!!);
            angle += 0.1
		});
    })

    return scene
}

// メッシュをクローンする
function cloneMesh(meshes: AbstractMesh[]) {
    let clone = meshes[1].clone("", meshes[0])
    if (clone == null) {
        return
    }
    clone.position = new Vector3(10, 0, 0)
}

let scene = createScene()

// 描画ループ
engine.runRenderLoop( () => {
    scene.render()
})

// ウィンドウのサイズが変わったとき
window.addEventListener('resize', () => {
    engine.resize()
})
