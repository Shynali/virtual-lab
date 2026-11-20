/* Сервер мекенжайы.
   - PHP хостингте (мысалы, ps.kz) сервер — осы папкадағы api.php.
   - GitHub Pages-те PHP жоқ, сондықтан онда сайт үлгі (демо) режимінде жұмыс істейді.
   Google Apps Script қолдансаңыз, API_URL орнына оның /exec сілтемесін жазыңыз. */
window.LAB_CONFIG = {
  API_URL: (/(^|\.)github\.io$/.test(location.hostname) || location.protocol === "file:") ? "" : "api.php"
};
