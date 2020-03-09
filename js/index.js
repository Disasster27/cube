
document.addEventListener( 'DOMContentLoaded', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const canvas = document.getElementById( 'canvas' );
    
    canvas.setAttribute( 'width', width ); 
    canvas.setAttribute( 'height', height ); 
    
    const renderer = new THREE.WebGLRenderer( { canvas : canvas, alpha : true } );
    // renderer.setClearColor( 0xaaaaaa )
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);

    const camera = new THREE.PerspectiveCamera( 85, width/height, 1, 5000 );
    camera.position.set( 0, 300, 0 );
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);

    const orbit = new THREE.OrbitControls( camera, canvas );

    const light = new THREE.AmbientLight( 0xffffff );
    scene.add( light );


   
    class Cube {
        constructor ( size ) {
            // длина грани
            this.size = size;
            this.zet = 0;
            this.farPlanePoint = [];
            this.nearPlanePoint = [];
            this.mesh = null;
            this.drawCube ( this.size );
        }
        // Mesh для вершин куба
        meshCreate () {
            const sphereGeometry = new THREE.SphereBufferGeometry( 1, 6, 6 );
            const sphereMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff } );
            const sphereMesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
            sphereMesh.scale.set( 1, 1, 1 );
            return sphereMesh;
        }
        // отрисовка вершин куба
        drawPoint ( x, y , z, size  ) {
            this.farPlanePoint = [];
            this.nearPlanePoint = [];
            this.zet = z;   
            this.pointCreate ( x, y, z, this.zet );
            this.pointCreate ( x, y + size, z, this.zet );
            this.pointCreate ( x + size, y + size, z, this.zet ); 
            this.pointCreate ( x + size, y, z, this.zet );
        
            this.pointCreate ( x, y, z + size, this.zet );
            this.pointCreate ( x, y + size, z + size, this.zet );
            this.pointCreate ( x + size, y + size, z + size, this.zet );
            this.pointCreate ( x + size, y, z + size, this.zet );
        }
        // задание координат вершин экземпляра куба
        pointCreate ( x, y, z, zet ) {
            const sphereMesh = this.meshCreate ();
            sphereMesh.position.x = x;
            sphereMesh.position.y = y;
            sphereMesh.position.z = z;
            this.mesh.add( sphereMesh );
            
            if ( z === zet ) {
                // массив с координатами дальней плоскости экземпляра куба
                this.farPlanePoint.push( sphereMesh );
            } else {
                // массив с координатами ближайшей плоскости экземпляра куба
                this.nearPlanePoint.push( sphereMesh );
            };
        }
        // отрисовка граней куба
        drawLine ( farPlanePoint,nearPlanePoint ) {
            // отрисовка граней между плоскостями
            for ( let i = 0 ; i < arguments[0].length ; i++ ) {
                const coordinate = [];
                coordinate.push( new THREE.Vector3( arguments[ 0 ][ i ].position.x, arguments[ 0 ][ i ].position.y, arguments[ 0 ][ i ].position.z ) );
                coordinate.push( new THREE.Vector3( arguments[ 1 ][ i ].position.x, arguments[ 1 ][ i ].position.y, arguments[ 1 ][ i ].position.z ) );
                const geometry = new THREE.BufferGeometry().setFromPoints( coordinate );
                const material = new THREE.LineBasicMaterial( { color: 0x000000 } );
                const line = new THREE.Line( geometry, material );
                this.mesh.add( line );
            };
            // отрисовка граней ближней и дальней плоскости экземпляра куба
            for ( let g = 0 ; g < arguments.length ; g++  ) {
                for ( let i = 0 ; i < arguments[g].length ; i++ ) {
                    const coordinate = [];

                    coordinate.push( new THREE.Vector3( arguments[ g ][ i ].position.x, arguments[ g ][ i ].position.y, arguments[ g ][ i ].position.z ) );
                    const j = i === 3 ? 0 : i + 1;
                    coordinate.push( new THREE.Vector3( arguments[ g ][ j ].position.x, arguments[ g ][ j ].position.y, arguments[ g ][ j ].position.z ) );

                    const geometry = new THREE.BufferGeometry().setFromPoints( coordinate );
                    const material = new THREE.LineBasicMaterial( { color: 0x000000 } );
                    const line = new THREE.Line( geometry, material );
                    this.mesh.add( line );
                };
            }; 
        }
        // Mesh для задания координат экземпляра куба
        mainMeshCreate ( position ) {
            const sphereGeometry = new THREE.SphereBufferGeometry( 1, 6, 6 );
            const sphereMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff } );
            this.mesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
            this.mesh.scale.set( 1, 1, 1 );
            this.mesh.position.x = Math.random() * 500 - 250 ;
            this.mesh.position.y = Math.random() * 500 - 250 ;
            this.mesh.position.z = Math.random() * 500 - 250 ;

            this.mesh.rotation.x = Math.random() * 2 * Math.PI;
            this.mesh.rotation.y = Math.random() * 2 * Math.PI;
            this.mesh.rotation.z = Math.random() * 2 * Math.PI;

            scene.add( this.mesh );
        }
        // финальная отрисовка экземпляка куба
        drawCube ( size ) {
            console.log(size)
            this.mainMeshCreate (  );
            this.drawPoint ( 0,0,0,size );
            this.drawLine( this.farPlanePoint,this.nearPlanePoint );

        }
    };
    
    // отрисовка всех кубов 
    function drawResult ( count ) {
        for ( let i = 0 ; i < count ; i ++ ) {
            new Cube( parseInt(Math.random() * 100) + 10 )
        };
    };

    // изменение колличества рисуемых кубов
    {
        const gui = new dat.GUI();

        const controls = {
            quantity : 10,
        };

        let numberOfCubes = gui.add( controls, 'quantity' ).step( 1 );
    
        numberOfCubes.onChange( function( value ){
            scene.children.length = 1;
            drawResult ( controls.quantity );
        } );

        drawResult ( controls.quantity );
    }

    // смена цвета граней по клику на вершину
    {
        let raycaster, mouse = new THREE.Vector2();
        init();

        function init () {
            raycaster = new THREE.Raycaster();
            renderer.domElement.addEventListener( 'click', raycast, false );
            renderer.domElement.addEventListener( 'touchend', raycast, false );
        };

        function raycast ( e ) {
            mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
            raycaster.setFromCamera( mouse, camera );    
            let intersects = raycaster.intersectObjects( scene.children, true );

            let meshColor = null;
            let positionCoordinatesString = '';

            for ( let i = 0; i < intersects.length; i++ ) {
                if ( intersects[ i ].object.type == 'Mesh' ) {
                    // цвет вершины 
                    meshColor = intersects[ i ].object.material.color;
                    // координаты вершины для сравнения с координатами граней
                    const positionCoordinates = [];
                    positionCoordinates.push( intersects[ i ].object.position.x );
                    positionCoordinates.push( intersects[ i ].object.position.y );
                    positionCoordinates.push( intersects[ i ].object.position.z );
                    positionCoordinatesString = positionCoordinates.join();
                };

                if ( intersects[ i ].object.type == 'Line' ) {
                    const lineCoordinates = [];
                    intersects[ i ].object.geometry.attributes.position.array.forEach( elem => {
                            lineCoordinates.push( elem );
                    } );
                    // получения координат начала и конца грани
                    const startCoordinates = lineCoordinates.slice( 0, 3 );
                    const endCoordinates = lineCoordinates.slice( 3,  );
                    let startCoordinatesString = startCoordinates.join();
                    let endCoordinatesString = endCoordinates.join();   
                    // проверка на принадлежность рёбер к вершине
                    if ( startCoordinatesString === positionCoordinatesString || endCoordinatesString === positionCoordinatesString ) {
                        // смена цвета
                        intersects[ i ].object.material.color = meshColor;
                    };
                };
            };
        };
    }

    function loop ( ) {
        TWEEN.update();
        orbit.update();
        renderer.render( scene, camera );
        requestAnimationFrame( function () { loop(); } );
    };

    loop();
});