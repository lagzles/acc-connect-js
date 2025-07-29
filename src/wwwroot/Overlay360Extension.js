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
    console.log("create 360 Background - start")
    const geometry = new THREE.SphereGeometry(500, 64, 64); // esfera grande
    geometry.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));

    
    
    
    const textureLoader = new THREE.TextureLoader();
    
    textureLoader.load(imageUrl, (texture) => {
      console.log('Imagem carregada com sucesso!', texture);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      this._sphereMesh = new THREE.Mesh(geometry, material);
      this.viewer.impl.scene.add(this._sphereMesh);
      this.viewer.impl.invalidate(true);
    }, undefined, (err) => {
      console.error('Erro ao carregar imagem:', err);
    });
    
    console.log('Esfera adicionada?', this._sphereMesh);
    console.log('Cena atual:', this.viewer.impl.scene.children);
    
    console.log("create 360 Background - end")
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension('Overlay360Extension', Overlay360Extension);
