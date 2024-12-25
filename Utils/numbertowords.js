function numberToWords(number) {
    const ones = [
        "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"
    ];
    const tens = [
        "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    ];
    const teens = [
        "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];
    const units = ["", "Thousand", "Lakh", "Crore"];
    
    if (number === 0) return "Zero Rupees";

    let words = "";
    let unitIndex = 0;

    while (number > 0) {
        let chunk = number % 1000;

        if (chunk !== 0) {
            let chunkWords = "";

            if (chunk > 99) {
                chunkWords += ones[Math.floor(chunk / 100)] + " Hundred ";
                chunk %= 100;
            }

            if (chunk > 10 && chunk < 20) {
                chunkWords += teens[chunk - 11] + " ";
            } else {
                chunkWords += tens[Math.floor(chunk / 10)] + " ";
                chunkWords += ones[chunk % 10] + " ";
            }

            words = chunkWords + units[unitIndex] + " " + words;
        }

        unitIndex++;
        number = Math.floor(number / 1000);
    }

    return words.trim() + " Rupees";
}

module.exports = numberToWords;