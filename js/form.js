'use strict';

(function () {
  var ROOMS_NUMBER_MAX = 100;

  var ERROR_TEXT_ROOMS = 'Выбранное количество комнат не соответствует выбранному количеству гостей';

  var adForm = document.querySelector('.ad-form');
  var selectTimeIn = adForm.querySelector('#timein');
  var selectTimeOut = adForm.querySelector('#timeout');
  var capacity = adForm.querySelector('#capacity');
  var roomNumber = adForm.querySelector('#room_number');
  var price = adForm.querySelector('#price');
  var roomType = adForm.querySelector('#type');
  var formFieldset = adForm.querySelectorAll('fieldset');
  var adFormReset = adForm.querySelector('.ad-form__reset');

  var OffsetTypeMap = {
    palace: {
      label: 'Дворец',
      minPrice: 10000
    },
    flat: {
      label: 'Квартира',
      minPrice: 1000
    },
    house: {
      label: 'Дом',
      minPrice: 5000
    },
    bungalo: {
      label: 'Бунгало',
      minPrice: 0
    }
  };

  var checkValidRooms = function () {
    var guests = capacity.value;
    var roomNumberValue = roomNumber.value;

    if (roomNumberValue < guests) {
      roomNumber.setCustomValidity(ERROR_TEXT_ROOMS);
    } else if (roomNumberValue === ROOMS_NUMBER_MAX && guests !== 0) {
      roomNumber.setCustomValidity(ERROR_TEXT_ROOMS);
    } else if (guests === 0 && roomNumberValue !== ROOMS_NUMBER_MAX) {
      roomNumber.setCustomValidity(ERROR_TEXT_ROOMS);
    } else {
      roomNumber.setCustomValidity('');
    }
  };

  var checkValidRoomsType = function () {
    var typeValue = roomType.value;
    var attributeValue = OffsetTypeMap[typeValue].minPrice;

    price.setAttribute('min', attributeValue);
    price.setAttribute('placeholder', attributeValue);
  };

  var synchronizeTimeIn = function () {
    selectTimeOut.value = selectTimeIn.value;
  };

  var synchronizeTimeOut = function () {
    selectTimeIn.value = selectTimeOut.value;
  };

  var resetForm = function () {
    adForm.reset();
    // изменяет, дефолтный плейсхолдер, в разметке, на корректный
    checkValidRoomsType();
  };

  var activate = function () {
    for (var i = 0; i < formFieldset.length; i++) {
      formFieldset[i].disabled = false;
    }
    adForm.classList.remove('ad-form--disabled');
  };

  var deactivate = function () {
    // проходит по филдсетам и проставляет disabled
    window.utils.disableElements(formFieldset);

    adForm.classList.add('ad-form--disabled');

    resetForm();

    window.utils.getAddressMainPin();
  };

  var removeSuccessMessage = function (evt) {
    if (evt.key === window.utils.Keys.ESCAPE || evt.button === 0 || evt.target.className === 'error__button') {
      document.querySelector('#message').remove();

      document.removeEventListener('keydown', removeSuccessMessage);
      document.removeEventListener('mousedown', removeSuccessMessage);

      window.init.disablePage();
    }
  };

  var errorMessage = function (errorText) {
    var template = document.querySelector('#error').content.querySelector('.error').cloneNode(true);
    var messageErrorText = template.querySelector('.error__message');
    template.id = 'message';
    messageErrorText.textContent = errorText;

    document.body.querySelector('main').appendChild(template);

    // чтобы за один клик, не появлялось и одновременно скрывалось, сообщение об ошибке, используется событие mousedown, а не click
    document.addEventListener('mousedown', removeSuccessMessage);
    document.addEventListener('keydown', removeSuccessMessage);
  };

  var successMessage = function () {
    var template = document.querySelector('#success').content.querySelector('.success').cloneNode(true);
    template.id = 'message';

    document.body.querySelector('main').appendChild(template);

    // чтобы за один клик, одновременно, не появлялось и скрывалось, сообщение об ошибке, используется событие mousedown, а не click
    document.addEventListener('mousedown', removeSuccessMessage);
    document.addEventListener('keydown', removeSuccessMessage);
  };

  var success = function () {
    successMessage();
    window.init.disablePage();
  };

  var formSubmitHandler = function (evt) {
    window.backend.save(new FormData(adForm), success, errorMessage);
    evt.preventDefault();
  };

  adFormReset.addEventListener('click', function () {
    resetForm();
    window.init.disablePage();
  });
  adForm.addEventListener('submit', formSubmitHandler);
  selectTimeIn.addEventListener('change', synchronizeTimeIn);
  selectTimeOut.addEventListener('change', synchronizeTimeOut);


  adForm.addEventListener('input', function () {
    checkValidRooms();
    checkValidRoomsType();
  });

  window.form = {
    checkValidRoomsType: checkValidRoomsType,
    activate: activate,
    deactivate: deactivate,
    offsetTypeMap: OffsetTypeMap,
    errorMessage: errorMessage
  };
})();