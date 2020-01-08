const _UTILS = {
    cleanForMatching: function(str) {
        str = str.replace(/\s\s+/g, " ");
        str = str.toUpperCase();
        str = str.replace("LIMITED", "LTD");
        str = str.replace("CORPORATION", "CORP");
        str = str.replace("COMPANY", "CO");
        str = str.split(",").join('');
        str = str.split(".").join('');
        str = str.split("(").join('');
        str = str.split(")").join('');
        return str.trim();
    },
    rateScore: function(days) {
        if (isNaN(days)) {
            return 0;
        }
        if (days == 0) {
            return 100;
        } else if (days <= 15) {
            return 75;
        } else if (days <= 30) {
            return 50;
        } else if (days <= 60 || days > 60) {
            return 25;
        }
    }

}
module.exports = _UTILS;