function Shader(gl,prefixId,attrIntializer){

    this.shaderProgram = undefined

    this.getShaderProgram = function(){
      return this.shaderProgram
    }

    this._getShader = function(gl, id) {
      this.gl = gl
      var shaderScript = document.getElementById(id)
      if (!shaderScript) {
        return null
      }
      var str = ''
      var k = shaderScript.firstChild
      while (k) {
        if (k.nodeType == 3) {
          str += k.textContent
        }
        k = k.nextSibling
      }
      var shader
      if (shaderScript.type == 'x-shader/x-fragment') {
        shader = gl.createShader(gl.FRAGMENT_SHADER)
      } else if (shaderScript.type = 'x-shader/x-vertex') {
        shader = gl.createShader(gl.VERTEX_SHADER)
      } else {
        return null
      }
      gl.shaderSource(shader, str)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader))
        return null
      }
      return shader
    }
    var fragmentShader = this._getShader(gl, prefixId+'-fs')
    var vertexShader = this._getShader(gl, prefixId+'-vs')
    
    this.shaderProgram = gl.createProgram()
    let shaderProgram = this.shaderProgram
    gl.attachShader(shaderProgram, fragmentShader)
    gl.attachShader(shaderProgram, vertexShader)

    gl.linkProgram(shaderProgram)

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert('Tidak bisa menginisialisasi shaders')
    }
    attrIntializer.execute(gl,shaderProgram)

}