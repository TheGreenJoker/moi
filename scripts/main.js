var App = {};

App.setup = function() {
    var canvas = document.createElement('canvas');
    this.filename = "spipa";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.canvas = canvas;
    document.getElementsByTagName('body')[0].
    appendChild(canvas);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.dataToImageRatio = 1;
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.msImageSmoothingEnabled = false;
    this.xC = this.width / 2;
    this.yC = this.height / 2;
    
    this.stepCount = 0;
    this.particles = [];
    this.lifespan = 1000;
    this.popPerBirth = 1;
    this.maxPop = 300;
    this.birthFreq = 2;

    // Build grid
    this.gridSize = 8; // Motion coords
    this.gridSteps = Math.floor(1000 / this.gridSize);
    this.grid = [];
    var i = 0;
    for (var xx = -500; xx < 500; xx += this.gridSize) {
        for (var yy = -500; yy < 500; yy += this.gridSize) {
            var r = Math.sqrt(xx*xx + yy*yy),
            r0 = 100,
            field;
        
            if (r < r0) field = 255 / r0 * r;
            else if (r > r0) field = 255 - Math.min(255, (r - r0)/2);
            
            this.grid.push({
                x: xx,
                y: yy,
                busyAge: 0,
                spotIndex: i,
                isEdge: (xx == -500 ? 'left' : 
                        (xx == (-500 + this.gridSize * (this.gridSteps-1)) ? 'right' : 
                        (yy == -500 ? 'top' : 
                        (yy == (-500 + this.gridSize *(this.gridSteps-1)) ? 'bottom' : 
                            false
                        )
                        )
                        )
                        ),
                field: field
            });
            i++;
        }
    }
    this.gridMaxIndex = i;
    
    // Préchargement du path de l'engrenage en SVG
    // Le <g> du SVG indique : translate(0,1280) scale(0.1,-0.1)
    // Ces transformations seront intégrées dans le dessin.
    this.gearPath = new Path2D("M5860 12792 c0 -4 -29 -174 -65 -377 -36 -204 -95 -541 -131 -750 -37 -209 -68 -381 -69 -383 -1 -1 -61 -14 -133 -27 -233 -45 -467 -108 -691 -187 -110 -38 -114 -39 -131 -21 -9 10 -225 268 -480 573 -255 305 -470 563 -480 573 -16 17 -38 5 -476 -248 -252 -146 -460 -269 -462 -274 -2 -5 115 -332 259 -727 l262 -717 -40 -36 c-289 -261 -333 -304 -614 -615 l-36 -39 -704 257 c-387 142 -714 258 -726 259 -19 2 -58 -61 -288 -457 -253 -438 -265 -460 -248 -476 10 -10 270 -228 578 -485 308 -257 566 -473 573 -479 10 -10 5 -35 -27 -127 -85 -249 -141 -456 -185 -688 -14 -74 -27 -135 -28 -136 -2 -1 -174 -32 -383 -69 -209 -36 -546 -95 -750 -131 -203 -36 -373 -65 -377 -65 -4 0 -8 -243 -8 -540 0 -297 4 -540 8 -540 4 0 174 -29 377 -65 204 -36 541 -95 750 -131 209 -37 381 -68 383 -69 1 -1 14 -62 28 -136 44 -232 100 -439 185 -688 32 -92 37 -117 27 -127 -7 -6 -265 -222 -573 -479 -308 -257 -568 -485 -578 -485 -17 -16 -5 -38 248 -476 230 -396 269 -459 288 -457 12 1 339 117 726 259 l704 257 36 -39 c281 -311 325 -354 614 -615 l40 -36 -262 -717 c-144 -395 -261 -722 -259 -727 2 -5 210 -128 462 -274 438 -253 460 -265 476 -248 10 10 225 268 480 573 255 305 471 563 480 573 17 18 21 17 131 -21 224 -79 458 -142 691 -187 72 -13 132 -26 133 -27 1 -2 32 -174 69 -383 36 -209 95 -546 131 -750 36 -203 65 -373 65 -377 0 -4 242 -8 538 -8 l538 0 52 292 c28 161 88 502 133 758 44 256 82 466 84 468 1 1 69 16 151 32 254 50 420 94 673 181 92 32 117 37 127 27 6 -7 222 -265 479 -573 257 -308 475 -568 485 -578 16 -17 38 -5 476 248 252 146 460 269 462 274 2 7 -163 465 -465 1290 l-57 154 65 56 c217 190 384 356 570 570 l55 64 185 -67 c708 -260 1250 -456 1257 -456 5 0 94 147 198 327 103 181 223 388 266 462 63 108 76 137 66 146 -7 7 -267 225 -578 485 -311 260 -571 478 -578 484 -10 10 -5 35 27 127 84 246 150 491 191 712 12 64 26 117 30 117 4 0 227 38 496 85 269 47 604 106 744 130 140 25 258 45 262 45 5 0 8 243 8 540 0 297 -4 540 -8 540 -4 0 -172 29 -372 64 -201 35 -539 95 -752 132 l-387 68 -21 115 c-41 219 -107 465 -191 710 -32 92 -37 117 -27 127 7 6 267 224 578 484 311 260 571 478 578 485 10 9 -3 38 -66 146 -43 74 -163 281 -266 462 -104 180 -193 327 -198 327 -7 0 -549 -196 -1257 -456 l-185 -67 -55 64 c-186 214 -353 380 -570 570 l-65 56 57 154 c302 825 467 1283 465 1290 -2 5 -210 128 -462 274 -438 253 -460 265 -476 248 -10 -10 -228 -270 -485 -578 -257 -308 -473 -566 -479 -573 -10 -10 -35 -5 -127 27 -253 87 -419 131 -673 181 -82 16 -150 31 -151 32 -2 2 -40 212 -84 468 -45 256 -105 597 -133 758 l-52 292 -538 0 c-296 0 -538 -4 -538 -8z m745 -2616 c678 -24 1405 -277 1985 -690 358 -254 675 -576 924 -936 373 -538 598 -1161 657 -1820 14 -161 14 -499 0 -660 -94 -1039 -601 -1983 -1416 -2632 -493 -393 -1095 -662 -1715 -767 -246 -42 -300 -46 -640 -46 -340 0 -394 4 -640 46 -1177 199 -2203 959 -2740 2030 -295 587 -425 1198 -398 1870 48 1199 680 2316 1688 2983 502 332 1046 531 1658 606 96 12 405 28 457 23 17 -1 98 -5 180 -7z");

    this.initDraw();
    };

App.setColor = function() {
    var hue = 200 + this.stepCount / 30;
    var color = 'hsla(' + hue + ', 95%, 50%, 0.8)';
    document.documentElement.style.setProperty('--color', color);
}

App.evolve = function() {
    this.stepCount++;
    
    // Incrémenter l'âge sur la grille
    this.grid.forEach(function(e) {
        if (e.busyAge > 0) e.busyAge++;
    });
    
    if (this.stepCount % this.birthFreq == 0 && (this.particles.length + this.popPerBirth) < this.maxPop) {
        this.birth();
    }

    this.setColor();
    this.move();
    this.draw();
};

App.birth = function() {
    var gridSpotIndex = Math.floor(Math.random() * this.gridMaxIndex),
        gridSpot = this.grid[gridSpotIndex],
        x = gridSpot.x, y = gridSpot.y;
    
    var particle = {
        hue: 200,
        sat: 95,
        lum: 20 + Math.floor(40 * Math.random()),
        x: x, y: y,
        xLast: x, yLast: y,
        xSpeed: 0, ySpeed: 0,
        age: 0,
        ageSinceStuck: 0,
        attractor: {
        oldIndex: gridSpotIndex,
        gridSpotIndex: gridSpotIndex,
        },
        name: 'seed-' + Math.ceil(10000000 * Math.random())
    };
    this.particles.push(particle);
};

App.kill = function(particleName) {
    this.particles = this.particles.filter(function(seed) {
        return seed.name != particleName;
    });
};

App.move = function() {
    for (var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];
        p.xLast = p.x; p.yLast = p.y;
        var index = p.attractor.gridSpotIndex,
            gridSpot = this.grid[index];
        
        if (Math.random() < 0.5) {
            if (!gridSpot.isEdge) {
                var topIndex = index - 1,
                    bottomIndex = index + 1,
                    leftIndex = index - this.gridSteps,
                    rightIndex = index + this.gridSteps;
                
                var topSpot = this.grid[topIndex],
                    bottomSpot = this.grid[bottomIndex],
                    leftSpot = this.grid[leftIndex],
                    rightSpot = this.grid[rightIndex];
                
                var chaos = 30;
                var maxFieldSpot = [topSpot, bottomSpot, leftSpot, rightSpot].reduce(function(prev, current) {
                return (prev.field + chaos * Math.random()) > (current.field + chaos * Math.random()) ? prev : current;
                });
                
                var potentialNewGridSpot = maxFieldSpot;
                if (potentialNewGridSpot.busyAge == 0 || potentialNewGridSpot.busyAge > 15) {
                    p.ageSinceStuck = 0;
                    p.attractor.oldIndex = index;
                    p.attractor.gridSpotIndex = potentialNewGridSpot.spotIndex;
                    gridSpot = potentialNewGridSpot;
                    gridSpot.busyAge = 1;
                } else {
                    p.ageSinceStuck++;
                }
            } else {
                p.ageSinceStuck++;
            }
            if (p.ageSinceStuck == 10) this.kill(p.name);
        }
        
        var k = 8, visc = 0.4;
        var dx = p.x - gridSpot.x,
            dy = p.y - gridSpot.y,
            dist = Math.sqrt(dx * dx + dy * dy);
        
        var xAcc = -k * dx,
            yAcc = -k * dy;
        
        p.xSpeed += xAcc; p.ySpeed += yAcc;
        p.xSpeed *= visc; p.ySpeed *= visc;
        
        p.speed = Math.sqrt(p.xSpeed * p.xSpeed + p.ySpeed * p.ySpeed);
        p.dist = dist;
        
        p.x += 0.1 * p.xSpeed; p.y += 0.1 * p.ySpeed;
        
        p.age++;
        if (p.age > this.lifespan) {
            this.kill(p.name);
        }
    }
};

App.initDraw = function() {
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.width, this.height);
    this.ctx.fillStyle = 'black';
    this.ctx.fill();
    this.ctx.closePath();
};

// Fonction de dessin de l'engrenage à partir du SVG

App.drawGearSVG = function() {
    var ctx = this.ctx;
    var centerX = this.xC;
    var centerY = this.yC;
    var rotation = this.stepCount / 50;
    var hue = 200 + this.stepCount / 30;
    var color = 'hsla(' + hue + ', 95%, 50%, 0.8)';

    // Calculer la taille désirée en pixels (5vh)
    var gearDesiredHeight = window.innerHeight * 0.1;
    // Estimation de la hauteur "originale" de l'engrenage avant transformation.
    // Cette valeur peut être ajustée en fonction du SVG.
    var originalGearHeight = 12800;
    var newScale = gearDesiredHeight / originalGearHeight;

    ctx.save();
    // On se positionne au centre de l'écran
    ctx.translate(centerX, centerY);
    // Rotation dynamique
    ctx.rotate(rotation);
    // Appliquer le nouveau facteur d'échelle
    ctx.scale(newScale, -newScale);
    // Ajuster la translation pour centrer le SVG
    // Les valeurs (-6000, -6400) sont des offsets obtenus expérimentalement.
    ctx.translate(-6000, -6400);
    
    ctx.fillStyle = color;
    ctx.fill(this.gearPath);
    ctx.restore();
};

App.draw = function() {
    // Création d'une traînée pour l'effet visuel
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.width, this.height);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fill();
    this.ctx.closePath();
    
    // Dessin des particules
    for (var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];
        var h = p.hue + this.stepCount / 30,
            s = p.sat,
            l = p.lum,
            a = 1;
        
        var last = this.dataXYtoCanvasXY(p.xLast, p.yLast),
            now = this.dataXYtoCanvasXY(p.x, p.y);
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + a + ')';
        this.ctx.moveTo(last.x, last.y);
        this.ctx.lineTo(now.x, now.y);
        this.ctx.lineWidth = 1.5 * this.dataToImageRatio;
        this.ctx.stroke();
        this.ctx.closePath();
    }
    
    // Dessin de l'engrenage SVG coloré au centre
    this.drawGearSVG();
};

App.dataXYtoCanvasXY = function(x, y) {
    var zoom = 1.6;
    var xx = this.xC + x * zoom * this.dataToImageRatio,
        yy = this.yC + y * zoom * this.dataToImageRatio;
    
    return {x: xx, y: yy};
};

document.addEventListener('DOMContentLoaded', function() {
    App.setup();
    var frame = function() {
        App.evolve();
        requestAnimationFrame(frame);
    };
    frame();
});
