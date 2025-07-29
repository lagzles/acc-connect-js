class Overlay360Extension extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);
    this._sphereMesh = null;
  }

  load() {
    console.log('Overlay360Extension loaded');
    this.create360Background(this.options.imageUrl || '');
    console.log('Overlay360Extension loaded');
    return true;
  }

  unload() {
    if (this._sphereMesh) {
      this.viewer.impl.scene.remove(this._sphereMesh);
      this._sphereMesh.geometry.dispose();
      this._sphereMesh.material.dispose();
      this._sphereMesh = null;
      this.viewer.impl.invalidate(true);
    }
    console.log('Overlay360Extension unloaded');
    return true;
  }

  create360Background(imageUrl) {
    const geometry = new THREE.SphereGeometry(500, 64, 64); // esfera grande
    //geometry.scale(-1, 1, 1); // inverte para ver por dentro
    geometry.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));



    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageUrl, (texture) => {
      const material = new THREE.MeshBasicMaterial({ map: texture });
      this._sphereMesh = new THREE.Mesh(geometry, material);
      this.viewer.impl.scene.add(this._sphereMesh);
      this.viewer.impl.invalidate(true);
    });
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension('Overlay360Extension', Overlay360Extension);
