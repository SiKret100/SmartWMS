import * as Print from 'expo-print';
import {shareAsync} from 'expo-sharing';

class ReportGenerator {

    static async printToFile(template, data) {
 const html = template(data);
        try {
            const {uri} = await Print.printToFileAsync({html});
            console.log('File has been saved to:', uri);
            await shareAsync(uri, {UTI: '.pdf', mimeType: 'application/pdf'});
        } catch (error) {
            console.error('Error creating PDF:', error);
        }
    }

}

export default ReportGenerator;
