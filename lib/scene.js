function Scene(factory) {
  var factory = factory
  var gl = factory.gl
  var mvMatrix = mat4.create()
  var pMatrix = mat4.create()

  this.mvMatrix = mvMatrix
  this.pMatrix = pMatrix

  this.factory = factory
  var shaderProgram = factory.shaderProgram
  this.shaderProgram = shaderProgram

  function setMatrixUniforms(shaderProgram,n) {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix)
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix)  
  }
  
  this.defaultDrawScene = function(){

    gl.disableVertexAttribArray(shaderProgram.vertexColorAttribute);
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute)
    gl.vertexAttrib4f(shaderProgram.vertexColorAttribute, 1, 1, 1, 1);

    gl.bindBuffer(gl.ARRAY_BUFFER, factory.cubeVertexPositionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(factory.cube.positions), gl.STATIC_DRAW)
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, factory.cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, factory.cubeTextureCoordBuffer)
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, factory.cubeTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0)

    
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, factory.crateTextures[2])
    gl.uniform1i(shaderProgram.samplerUniform, 0)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, factory.cubeVertexIndexBuffer)
    setMatrixUniforms(shaderProgram)

    gl.drawElements(gl.TRIANGLES, factory.cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0)
    
    let whiteTex = gl.createTexture();
    gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);
    gl.bindTexture(gl.TEXTURE_2D, whiteTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([1, 1, 1, 1]));

    
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, factory.hurufVertexPositionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(factory.huruf.positions), gl.STATIC_DRAW)
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, factory.hurufVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)

    setMatrixUniforms(shaderProgram)
    gl.drawArrays(gl.TRIANGLES, 0, factory.hurufVertexPositionBuffer.numItems)

  }


  this.setGlViewPort = function(sx,sy,w,h){
    gl.viewport(sx,sy,w,h)
  }
  //please override this  
  this.drawScene = function(sx,sy,w,h){
    this.setGlViewPort(sx,sy,w,h)
    this.defaultDrawScene()
  }

}

