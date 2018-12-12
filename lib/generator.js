function GenerateGeometry(vertices, faces) {
    var result = []
    for (var a=0;a<faces.length;a++) {
        for(var b=0;b<faces[a].length;b++){
            result = result.concat(vertices[faces[a][b]])
        }
    }
    return result
}

function GenerateColor(vertices, faces) {
    var result = []
    var color_map = []
    for (var a=0;a<vertices.length;a++) {
        color_map.push([Math.random(), Math.random(), Math.random(), 1.0])
    }
    for (var a=0;a<faces.length;a++) {
        for (var b=0;b<faces[a].length;b++) {
            result = result.concat(color_map[faces[a][b]])
        }
    }
    return result
}