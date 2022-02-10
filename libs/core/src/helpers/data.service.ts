class DataService {
    BASE_URL: string;

    constructor() {
        if (window.location.href.indexOf('/app/') > -1) {
            this.BASE_URL = '../'
        } else if (window.location.href.indexOf('/kagami-generated') > -1) {
            this.BASE_URL = '';
        } else {
            this.BASE_URL = "https://135.181.202.86:12002/kagami-generated_Srinivasa_Live/";
            this.BASE_URL = "https://demo.kagamierp.com:12009/kagami-generated_MBPL_NEW/";
        }
    }
}

export default new DataService();