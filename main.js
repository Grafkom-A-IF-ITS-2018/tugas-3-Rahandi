/** @type {WebGLRenderingContext} */

var gl

function getShader(gl, id) {
    let shaderScript = document.getElementById(id)
    if (!shaderScript) {
        return null
    }
    let str = ''
    let k = shaderScript.firstChild
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent
        }
        k = k.nextSibling
    }
    let shader
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
        return null
    }
    return shader
}

async function handleLoadedTexture(texture) {
    await gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    await gl.bindTexture(gl.TEXTURE_2D, texture)
    await gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.UNSIGNED_BYTE, texture.image)
    await gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    await gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    texture.loaded = true
}

function WebGL(id) {
    var canvas = document.getElementById(id)
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    this.mvMatrix = [
        mat4.create(),
        mat4.create(),
        mat4.create(),
        mat4.create()
    ]
    this.pvMatrix = this.mvMatrix.slice()
    this.mvMatrixStack = this.mvMatrix.slice()
    this.object3dBuffer = []
    initShader = initShader.bind(this)

    initGL(canvas)
    initShader()

    gl.clearColor(0.0, 0.0, 0.0, 0.0)
    gl.enable(gl.DEPTH_TEST)

    function initGL(canvas) {
        gl = canvas.getContext('webgl')
        gl.viewport_width = canvas.width
        gl.viewport_height = canvas.height
    }

    function initShader() {
        let fragmentShader = getShader(gl, 'shader-fs')
        let vertexShader = getShader(gl, 'shader-vs')

        this.shaderProgram = gl.createProgram()
        
        gl.attachShader(shaderProgram, fragmentShader)
        gl.attachShader(shaderProgram, vertexShader)
        gl.linkProgram(shaderProgram)

        gl.useProgram(shaderProgram)

        this.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, 'aVertexPosition')
        this.shaderProgram.vertexColorAttribute = gl.getAttribLocation(this.shaderProgram, 'aVertexColor')
        this.shaderProgram.vertexNormalAttribute = gl.getAttribLocation(this.shaderProgram, 'aVertexNormals')
        this.shaderProgram.textureCoordAttribute = gl.getAttribLocation(this.shaderProgram, 'aTextureCoord')
        this.shaderProgram.pMatrixUniform = gl.getAttribLocation(this.shaderProgram, 'uPMatrix')
        this.shaderProgram.mvMatrixUniform = gl.getAttribLocation(this.shaderProgram, 'uMVatrix')
        this.shaderProgram.nMatrixUniform = gl.getAttribLocation(this.shaderProgram, 'uNMatrix')
        this.shaderProgram.samplerUniform = gl.getAttribLocation(this.shaderProgram, 'uSampler')
        this.shaderProgram.useLightingUniform = gl.getAttribLocation(this.shaderProgram, 'uUseLighting')
        this.shaderProgram.ambientColorUniform = gl.getAttribLocation(this.shaderProgram, 'uAmbientColor')
        this.shaderProgram.lightingDirectionUniform = gl.getAttribLocation(this.shaderProgram, 'uLightingDirection')
        this.shaderProgram.pointLightingLocationUniform = gl.getAttribLocation(this.shaderProgram, 'uPointLightingLocation')
        this.shaderProgram.pointLightingColorUniform = gl.getAttribLocation(this.shaderProgram, 'uPointLightingColor')
        this.shaderProgram.alphaUniform = gl.getAttribLocation(this.shaderProgram, 'uAlpha')
        this.shaderProgram.shiniUniform = gl.getAttribLocation(this.shaderProgram, 'uShininess')

        gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute)
        gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute)
        gl.enableVertexAttribArray(this.shaderProgram.vertexNormalAttribute)
        gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute)
    }

    function mvPushMatrix(cube_id) {
        let dup = mat4.create()

        mat4.copy(dup, this.mvMatrix[cube_id])
        this.mvMatrixStack[cube_id].push(dup)
    }

    function mvPopMatrix(cube_id) {
        this.mvMatrix[cube_id] = this.mvMatrixStack[cube_id].pop()
    }

    function setMatrixUniform(cube_id) {
        let normalMatrix = mat3.create()

        mat3.normalFromMat4(normalMatrix, this.mvMatrix[cube_id])

        gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pvMatrix[cube_id])
        gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix[cube_id])
        gl.uniformMatrix3fv(this.shaderProgram.nMatrixUniform, false, normalMatrix)
    }

    function add(object3d) {
        let buffer = {}
        if (object3d.type == 'geometry') {
            buffer.type = 'geometry'
            buffer.geometry = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer.geometry)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object3d.geometry), gl.STATIC_DRAW)
            buffer.geometry.itemSize = 3
            buffer.geometry.numItems = object3d.geometry.length / buffer.itemSize
            
            buffer.color = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer.color)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object3d.color), gl.STATIC_DRAW)
            buffer.color.itemSize = 4
            buffer.color.numItems = buffer.geometry.numItems
            this.object3dBuffer.push(buffer)
        }
        else {
            buffer.type = 'lighting'
            gl.uniform1i(this.shaderProgram.useLightingUniform, 1)
            gl.uniform1f(this.shaderProgram.shiniUniform, 5.0)
            this.object3dBuffer.push(buffer)
        }
    }
}