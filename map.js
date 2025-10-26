document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('map-container');
    const mapImage = document.getElementById('carte-za');

    let scale = 1;      // Le niveau de zoom actuel
    let translateX = 0; // Déplacement horizontal de l'image
    let translateY = 0; // Déplacement vertical de l'image

    const zoomSpeed = 0.1; // Vitesse du zoom à la molette
    const maxScale = 5;    // Zoom maximum (500%)
    const minScale = 1;    // Zoom minimum (100%)

    let isDragging = false; // Indique si l'utilisateur est en train de glisser (bouton de souris enfoncé)
    let startPointerX = 0;  // Position X du pointeur (souris) au début du drag
    let startPointerY = 0;  // Position Y du pointeur (souris) au début du drag
    let startTranslateX = 0; // Position X de l'image au début du drag
    let startTranslateY = 0; // Position Y de l'image au début du drag


    // Applique les transformations (zoom et déplacement) à l'image
    function applyTransform() {
        mapImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    // Fonction pour contraindre le déplacement afin que l'image reste visible dans le conteneur
    function constrainPan() {
        const containerRect = mapContainer.getBoundingClientRect();
        
        // Si l'image est plus petite ou égale au conteneur (pas zoomée ou peu)
        // La condition est basée sur la taille du conteneur * scale vs containerRect.width
        const scaledContentWidth = containerRect.width * scale;
        const scaledContentHeight = containerRect.height * scale;

        // Si le contenu zoomé est plus petit ou égal au conteneur, on ne déplace pas
        if (scaledContentWidth <= containerRect.width && scaledContentHeight <= containerRect.height) {
            translateX = 0;
            translateY = 0;
            return;
        }

        const maxTranslateXLeft = 0;
        const maxTranslateXRight = -(scaledContentWidth - containerRect.width);
        const maxTranslateYTop = 0;
        const maxTranslateYBottom = -(scaledContentHeight - containerRect.height);
        
        // Appliquer les contraintes
        translateX = Math.max(maxTranslateXRight, Math.min(maxTranslateXLeft, translateX));
        translateY = Math.max(maxTranslateYBottom, Math.min(maxTranslateYTop, translateY));
    }


    // Gestion de l'événement de la molette pour le zoom
    mapContainer.addEventListener('wheel', (e) => {
        e.preventDefault(); // Empêche le défilement de la page

        // Réinitialisation explicite de isDragging pour éviter les interférences
        isDragging = false;
        mapContainer.classList.remove('dragging');

        const containerRect = mapContainer.getBoundingClientRect();

        const mouseX = e.clientX - containerRect.left;
        const mouseY = e.clientY - containerRect.top;

        const mouseXInImage = (mouseX - translateX) / scale;
        const mouseYInImage = (mouseY - translateY) / scale;

        const newScale = e.deltaY < 0 ? scale + zoomSpeed : scale - zoomSpeed;
        scale = Math.max(minScale, Math.min(maxScale, newScale));

        if (scale === minScale) {
            translateX = 0;
            translateY = 0;
        } else {
            translateX = mouseX - mouseXInImage * scale;
            translateY = mouseY - mouseYInImage * scale;
        }
        
        constrainPan();
        applyTransform();
    }, { passive: false });

    // Gestion du clic enfoncé pour le déplacement (pan)
    mapContainer.addEventListener('mousedown', (e) => {
        // S'assurer que c'est le clic gauche de la souris (bouton 0)
        // et que nous sommes zoomés au-delà du minimum
        if (e.button === 0 && scale > minScale) {
            isDragging = true;
            mapContainer.classList.add('dragging'); // Change le curseur
            startPointerX = e.clientX;
            startPointerY = e.clientY;
            startTranslateX = translateX;
            startTranslateY = translateY;
            e.preventDefault(); // Empêche la sélection de texte ou d'autres comportements par défaut si la souris est sur l'image
        } else {
            // Si ce n'est pas un clic gauche ou si on n'est pas zoomé, on s'assure que isDragging est false
            isDragging = false;
            mapContainer.classList.remove('dragging');
        }
    });

    // Gestion du déplacement de la souris
    mapContainer.addEventListener('mousemove', (e) => {
        // NOUVELLE VÉRIFICATION : S'assurer que le bouton gauche est toujours enfoncé
        // (e.buttons & 1) vérifie si le 1er bit (bouton gauche) est à 1
        if (!isDragging || !(e.buttons & 1)) {
            isDragging = false; // Réinitialise au cas où e.buttons ne correspond pas
            mapContainer.classList.remove('dragging');
            return;
        }
        e.preventDefault(); 

        const dx = e.clientX - startPointerX;
        const dy = e.clientY - startPointerY;

        translateX = startTranslateX + dx;
        translateY = startTranslateY + dy;

        constrainPan();
        applyTransform();
    });

    // Gestion du relâchement du clic
    const stopDragging = () => {
        if (isDragging) {
            isDragging = false;
            mapContainer.classList.remove('dragging');
        }
    };

    mapContainer.addEventListener('mouseup', stopDragging);
    mapContainer.addEventListener('mouseleave', stopDragging);
    document.body.addEventListener('mouseup', stopDragging); 

    // Empêcher le menu contextuel (clic droit) d'apparaître sur la carte
    mapContainer.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        isDragging = false; // Au cas où un clic droit mettrait fin à un drag en cours
        mapContainer.classList.remove('dragging');
    });
});