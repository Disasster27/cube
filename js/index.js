
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


   

    


    const cube = {
        zet : 0,
        farPlanePoint : [],
        nearPlanePoint : [],
        mesh : null,
        meshCreate () {
            const sphereGeometry = new THREE.SphereBufferGeometry( 1, 6, 6 );
            const sphereMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff } );
            const sphereMesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
            sphereMesh.scale.set( 1, 1, 1 );
            return sphereMesh;
        },
        drawPoint ( x, y , z, e  ) {
            this.farPlanePoint = [];
            this.nearPlanePoint = [];
            this.zet = z;   
            this.pointCreate ( x, y, z, this.zet );
            this.pointCreate ( x, y + e, z, this.zet );
            this.pointCreate ( x + e, y + e, z, this.zet ); 
            this.pointCreate ( x + e, y, z, this.zet );
        
            this.pointCreate ( x, y, z + e, this.zet );
            this.pointCreate ( x, y + e, z + e, this.zet );
            this.pointCreate ( x + e, y + e, z + e, this.zet );
            this.pointCreate ( x + e, y, z + e, this.zet );
        },
        pointCreate ( x, y, z, zet ) {
            const sphereMesh = this.meshCreate ();
            sphereMesh.position.x = x;
            sphereMesh.position.y = y;
            sphereMesh.position.z = z;
            this.mesh.add( sphereMesh );
            if ( z === zet ) {
                this.farPlanePoint.push( sphereMesh );
            } else {
                this.nearPlanePoint.push( sphereMesh );
            };
        },
        draw ( farPlanePoint,nearPlanePoint ) {
            // console.log(arguments)
            for ( let i = 0 ; i < arguments[0].length ; i++ ) {
                const coordinate = [];
                coordinate.push( new THREE.Vector3( arguments[ 0 ][ i ].position.x, arguments[ 0 ][ i ].position.y, arguments[ 0 ][ i ].position.z ) );
                coordinate.push( new THREE.Vector3( arguments[ 1 ][ i ].position.x, arguments[ 1 ][ i ].position.y, arguments[ 1 ][ i ].position.z ) );
                const geometry = new THREE.BufferGeometry().setFromPoints( coordinate );
                const material = new THREE.LineBasicMaterial( { color: 0x000000 } );
                const line = new THREE.Line( geometry, material );
                this.mesh.add( line );
            };
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
                }
            }
            
            
        },
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
        },
        drawCube ( size ) {
            this.mainMeshCreate (  );
            this.drawPoint ( 0,0,0,size );

            this.draw( this.farPlanePoint,this.nearPlanePoint );

        },
        drawResult ( count ) {
            for ( let i = 0 ; i < count ; i ++ ) {
                cube.drawCube ( parseInt(Math.random() * 50) + 10 );
            };
        },
    };

    const gui = new dat.GUI();

    const controls = {
        quantity : 10,
    };

    let numberOfCubes = gui.add( controls, 'quantity' ).step( 1 )
    cube.drawResult ( controls.quantity );
  
    numberOfCubes.onChange( function( value ){
        scene.children.length = 1;
        cube.drawResult ( controls.quantity );
     } );





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

                meshColor = intersects[ i ].object.material.color;

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

                const startCoordinates = lineCoordinates.slice( 0, 3 );
                const endCoordinates = lineCoordinates.slice( 3,  );
                let startCoordinatesString = startCoordinates.join();
                let endCoordinatesString = endCoordinates.join();   

                if ( startCoordinatesString === positionCoordinatesString || endCoordinatesString === positionCoordinatesString ) {
                    intersects[ i ].object.material.color = meshColor;
                } else { 
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