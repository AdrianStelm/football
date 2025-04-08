document.getElementById('changeImageBtn').addEventListener('click', function() {
    // Получаем элемент изображения на кнопке
    var buttonImage = document.getElementById('buttonImage');
    
    // Меняем источник изображения на кнопке
    if (buttonImage.src.includes('../icons/Component 2.svg')) {
        buttonImage.src = '../icons/images.png'; // Новое изображение
    } else {
        buttonImage.src = '../icons/Component 2.svg'; // Исходное изображение
    }
});