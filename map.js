document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('map-container');
    const mapImage = document.getElementById('carte-za');

    let scale = 1; // Le niveau de zoom actuel
    let translateX = 0; // Déplacement horizontal de l'image
    let translateY = 0; // Déplacement vertical de l'image

    const zoomSpeed = 0.1; // Vitesse du zoom à la molette
    const maxScale = 5;    // Zoom maximum (500%)
    const minScale = 1;    // Zoom minimum (100%)

    let isDragging = false; // Indique si l'utilisateur est en train de glisser
    let startX, startY;     // Coordonnées de départ du glisser

    // Applique les transformations (zoom et déplacement) à l'image
    function applyTransform() {
        mapImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    // Gestion de l'événement de la molette pour le zoom
    mapContainer.addEventListener('wheel', (e) => {
        e.preventDefault(); // Empêche le défilement de la page

        const containerRect = mapContainer.getBoundingClientRect();

        // Calculer la position du curseur par rapport au conteneur
        // clientX/Y sont les coordonnées globales de la souris
        // containerRect.left/top sont les coordonnées du coin supérieur gauche du conteneur
        const mouseX = e.clientX - containerRect.left;
        const mouseY = e.clientY - containerRect.top;

        // Calculer la position du curseur par rapport à l'image *actuellement zoomée/déplacée*
        // C'est ce point qui doit rester sous le curseur après le zoom
        const mouseXInImage = (mouseX - translateX) / scale;
        const mouseYInImage = (mouseY - translateY) / scale;

        // Déterminer la nouvelle échelle de zoom
        const newScale = e.deltaY < 0 ? scale + zoomSpeed : scale - zoomSpeed;
        scale = Math.max(minScale, Math.min(maxScale, newScale)); // Limiter le zoom

        // Si on est au zoom minimum (1), réinitialiser la position
        if (scale === 1) {
            translateX = 0;
            translateY = 0;
        } else {
            // Calculer les nouveaux déplacements pour que le point sous le curseur reste fixe
            translateX = mouseX - mouseXInImage * scale;
            translateY = mouseY - mouseYInImage * scale;

            // Appliquer des contraintes de déplacement pour ne pas sortir de la carte
            const maxTranslateX = (scale - 1) * containerRect.width;
            const maxTranslateY = (scale - 1) * containerRect.height;

            translateX = Math.max(-maxTranslateX, Math.min(0, translateX));
            translateY = Math.max(-maxTranslateY, Math.min(0, translateY));
        }

        applyTransform();
    });

    // Gestion du clic enfoncé pour le déplacement (pan)
    mapContainer.addEventListener('mousedown', (e) => {
        if (scale > 1) { // Ne permettre le déplacement que si on est zoomé
            isDragging = true;
            mapContainer.classList.add('dragging'); // Change le curseur
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
        }
    });

    // Gestion du déplacement de la souris
    mapContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault(); // Empêche la sélection de texte lors du glisser

        const containerRect = mapContainer.getBoundingClientRect();

        translateX = e.clientX - startX;
        translateY = e.clientY - startY;

        // Appliquer des contraintes de déplacement pour ne pas sortir de la carte
        const maxTranslateX = (scale - 1) * containerRect.width;
        const maxTranslateY = (scale - 1) * containerRect.height;

        translateX = Math.max(-maxTranslateX, Math.min(0, translateX));
        translateY = Math.max(-maxTranslateY, Math.min(0, translateY));

        applyTransform();
    });

    // Gestion du relâchement du clic
    mapContainer.addEventListener('mouseup', () => {
        isDragging = false;
        mapContainer.classList.remove('dragging');
    });

    // Gérer si la souris sort du conteneur pendant le glisser
    mapContainer.addEventListener('mouseleave', () => {
        isDragging = false;
        mapContainer.classList.remove('dragging');
    });
});