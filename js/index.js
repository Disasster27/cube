
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
    camera.position.set( 0, 1000, 0 );
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);

    const orbit = new THREE.OrbitControls( camera, canvas );

    const light = new THREE.AmbientLight( 0xffffff );
    scene.add( light );


   
    class Cube {
        constructor ( size, count ) {
            // длина грани
            this.size = size;
            this.farPlanePoint = [];
            this.nearPlanePoint = [];
            this.mesh = null;
            this.cubeQuantity = count;
            this.drawCube ( );
        }
        // Mesh для вершин куба
        meshCreate () {
            let i = this.SetRangeOfCoordinates().meshRadius;
            const sphereGeometry = new THREE.SphereBufferGeometry( `${ i }`, 6, 6 );
            const sphereMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff } );
            const sphereMesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
            sphereMesh.scale.set( 1, 1, 1 );
            return sphereMesh;
        }
        // отрисовка вершин куба
        drawPoint ( x, y , z ) {
            this.farPlanePoint = [];
            this.nearPlanePoint = []; 
            this.pointCreate ( x, y, z );
            this.pointCreate ( x, y + this.size, z );
            this.pointCreate ( x + this.size, y + this.size, z ); 
            this.pointCreate ( x + this.size, y, z );
        
            this.pointCreate ( x, y, z + this.size );
            this.pointCreate ( x, y + this.size, z + this.size );
            this.pointCreate ( x + this.size, y + this.size, z + this.size );
            this.pointCreate ( x + this.size, y, z + this.size );
        }
        // задание координат вершин экземпляра куба
        pointCreate ( x, y, z ) {
            const sphereMesh = this.meshCreate ();
            sphereMesh.position.x = x;
            sphereMesh.position.y = y;
            sphereMesh.position.z = z;
            this.mesh.add( sphereMesh );
            
            if ( z === 0 ) {
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
            let i = this.SetRangeOfCoordinates().coordinate;

            this.mesh.position.x = Math.random() * i - i / 2 ;
            this.mesh.position.y = Math.random() * i - i / 2 ;
            this.mesh.position.z = Math.random() * i - i / 2 ;

            this.mesh.rotation.x = Math.random() * 2 * Math.PI;
            this.mesh.rotation.y = Math.random() * 2 * Math.PI;
            this.mesh.rotation.z = Math.random() * 2 * Math.PI;

            scene.add( this.mesh );
        }
        // увеличивает диапазон координат и размер вершин при увеличении колличества отображаемых кубов
        SetRangeOfCoordinates () {
            let coordinate;
            let meshRadius;
            if ( this.cubeQuantity <= 100 ) {
                coordinate = 800; 
                meshRadius = 3;
            } else if ( 100 < this.cubeQuantity <= 300 ) {
                coordinate = 1500;
                meshRadius = 4;
            } else if ( 300 < this.cubeQuantity <= 700 ) {
                coordinate = 2000;
                meshRadius = 5;
            } else if ( 700 < this.cubeQuantity  ) {
                coordinate = 2800;
                meshRadius = 6;
            };
            return { coordinate, meshRadius };
        }
        // финальная отрисовка экземпляка куба
        drawCube ( size ) {
            // console.log(size)
            this.mainMeshCreate (  );
            this.drawPoint ( 0,0,0,size );
            this.drawLine( this.farPlanePoint,this.nearPlanePoint );

        }
    };
    
    // отрисовка всех кубов 
    function drawResult ( count ) {
        for ( let i = 0 ; i < count ; i ++ ) {
            new Cube( parseInt(Math.random() * 100) + 10, count )
        };
    };

    // изменение колличества рисуемых кубов
    {
        const gui = new dat.GUI();

        const controls = {
            quantity : 10,
        };

        let numberOfCubes = gui.add( controls, 'quantity' ).min( 1 ).step( 1 );
    
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
                    // console.log(intersects[ i ].object)
                    // цвет вершины 
                    meshColor = intersects[ i ].object.material.color;
                    // координаты вершины для сравнения с координатами граней
                    const positionCoordinates = [];
                    positionCoordinates.push( intersects[ i ].object.position.x );
                    positionCoordinates.push( intersects[ i ].object.position.y );
                    positionCoordinates.push( intersects[ i ].object.position.z );
                    // строчное значение
                    positionCoordinatesString = positionCoordinates.join();
            
                    for ( let key in intersects[ i ].object.parent.children ) {
                        // с 8 позиции идут дочерние элементы с type : line
                        if ( key > 7 ) {
                            const lineCoordinates = [];
                            intersects[ i ].object.parent.children[key].geometry.attributes.position.array.forEach( elem => {
                            lineCoordinates.push( elem );
                            } );
                            // получения координат начала и конца грани
                            const startCoordinates = lineCoordinates.slice( 0, 3 );
                            const endCoordinates = lineCoordinates.slice( 3,  );
                            // их строчное значение
                            let startCoordinatesString = startCoordinates.join();
                            let endCoordinatesString = endCoordinates.join();
                            // проверка на принадлежность рёбер к вершине 
                            if ( startCoordinatesString === positionCoordinatesString || endCoordinatesString === positionCoordinatesString ) {
                                // смена цвета
                                intersects[ i ].object.parent.children[key].material.color = meshColor;
                            };
                        };
                    };
                };
            };
        };
    };


    function loop ( ) {
        TWEEN.update();
        orbit.update();
        renderer.render( scene, camera );
        requestAnimationFrame( function () { loop(); } );
    };

    loop();
});