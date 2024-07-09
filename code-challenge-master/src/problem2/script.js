document.addEventListener("DOMContentLoaded", () => {
    const tokenIconsUrl = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/';
    const repoApiUrl = 'https://api.github.com/repos/Switcheo/token-icons/contents/tokens';
    const pricesApiUrl = 'https://interview.switcheo.com/prices.json';
    const sendCurrencySelect = document.getElementById('send-currency');
    const receiveCurrencySelect = document.getElementById('receive-currency');
    const exchangeRateDisplay = document.getElementById('exchange-rate');
    const sendInput =  document.getElementById('sendinput');
    const receiveInput =  document.getElementById('receive-input');
    const closeBtn = document.getElementById('closeModal');
    const modal = document.getElementById('modal');
    const modalMsg = document.getElementById('modal-message');
    const defaultToken1 = 'BLUR';
    const defaultToken2 = 'BUSD';
    let tokenPrices = {};
  
    const fetchTokenData = fetch(repoApiUrl)
      .then(response => response.json())
      .then(data => {
        const tokenFilenames = data.filter(file => file.name.endsWith('.svg')).map(file => file.name);
        populateSelect(sendCurrencySelect, tokenFilenames, defaultToken1);
        populateSelect(receiveCurrencySelect, tokenFilenames, defaultToken2);
  
        setDefaultIcon('send-icon', defaultToken1);
        setDefaultIcon('receive-icon', defaultToken2);
      })
      .catch(error => console.error('Error loading token data:', error));
  
    const fetchTokenPrices = fetch(pricesApiUrl)
      .then(response => response.json())
      .then(data => {
        tokenPrices = {};
        data.forEach(item => {
          tokenPrices[item.currency] = item.price;
        });
      })
      .catch(error => console.error('Error loading token prices:', error));
  
    Promise.all([fetchTokenData, fetchTokenPrices])
      .then(() => {
        updateExchangeRate();
      });
    
  
    function populateSelect(selectElement, filenames, defaultToken) {
      filenames.forEach(filename => {
        const tokenName = filename.replace('.svg', ''); 
        const option = document.createElement('option');
        option.value = tokenName;
        option.textContent = tokenName;
  
        if (tokenName === defaultToken) {
          option.selected = true;
        }
  
        selectElement.appendChild(option);
      });
    }
  
    function setDefaultIcon(iconId, tokenName) {
      const iconUrl = `${tokenIconsUrl}${tokenName}.svg`;
      const iconImg = document.getElementById(iconId);
      iconImg.src = iconUrl;
      iconImg.alt = `${tokenName} icon`;
    }
  
    function swapTokens() {
      const sendCurrencySelect = document.getElementById('send-currency');
      const receiveCurrencySelect = document.getElementById('receive-currency');
      const sendIcon = document.getElementById('send-icon');
      const receiveIcon = document.getElementById('receive-icon');
  
      const tempCurrency = sendCurrencySelect.value;
      sendCurrencySelect.value = receiveCurrencySelect.value;
      receiveCurrencySelect.value = tempCurrency;
  
      const tempIcon = sendIcon.src;
      sendIcon.src = receiveIcon.src;
      receiveIcon.src = tempIcon;
  
      updateExchangeRate();
    }
  
    function showSelectedIcon(selectElement, iconId) {
      const selectedOption = selectElement.options[selectElement.selectedIndex];
      const iconUrl = `${tokenIconsUrl}${selectedOption.value}.svg`;
      const iconImg = document.getElementById(iconId);
      iconImg.src = iconUrl;
      iconImg.alt = `${selectedOption.value} icon`;
      updateExchangeRate();
    }
  
    function updateExchangeRate() {
        const sendCurrency = sendCurrencySelect.value;
        const receiveCurrency = receiveCurrencySelect.value;
        const sendValue = parseFloat(sendInput.value) || 0;
        const receiveValue = parseFloat(receiveInput.value) || 0;
    
        const sendPrice = tokenPrices[sendCurrency];
        const receivePrice = tokenPrices[receiveCurrency];
    
        if (sendPrice !== undefined && receivePrice !== undefined) {
            let rate;
            if (sendValue !== 0 && receiveValue !== 0) {
                rate = (sendPrice * receiveValue) / (receivePrice * sendValue);
                exchangeRateDisplay.textContent = `${sendValue} ${sendCurrency} = ${rate.toFixed(4)} ${receiveCurrency}`;
            } else {
                rate = sendPrice / receivePrice;
                exchangeRateDisplay.textContent = `1 ${sendCurrency} = ${rate.toFixed(4)} ${receiveCurrency}`;
            }
        } else {
            exchangeRateDisplay.textContent = 'Exchange rate not available';
        }
    }
    
    
    function submitClicked() {
    const sendValue = sendInput.value;
    const receiveValue = receiveInput.value;
    const sendCurrency = sendCurrencySelect.value;
    const receiveCurrency = receiveCurrencySelect.value;

    if (sendValue === "" || receiveValue === "") {
        window.alert('Please do not leave any fields blank.');
    } else {
        const message = `You will be sending ${sendValue} ${sendCurrency}s and receiving ${receiveValue} ${receiveCurrency}s.`;
        const modalMessage = document.getElementById('modal-message');
        modalMessage.textContent = message;
        modal.classList.add("open");
    }
}


    const submitButton = document.getElementById('submit');
    submitButton.addEventListener('click', submitClicked);

    sendCurrencySelect.addEventListener('change', event => {
      showSelectedIcon(event.target, 'send-icon');
    });
  
    receiveCurrencySelect.addEventListener('change', event => {
      showSelectedIcon(event.target, 'receive-icon');
    });

    closeBtn.addEventListener("click", () => {
        modal.classList.remove("open");
    })

    sendInput.addEventListener('input', updateExchangeRate); 
    receiveInput.addEventListener('input', updateExchangeRate); 
  
    window.swapTokens = swapTokens;
  });
  