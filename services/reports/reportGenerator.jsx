import * as Print from 'expo-print';
import {shareAsync} from 'expo-sharing';
import reportService from "../dataServices/reportService";
class ReportGenerator {

    static printToFile = async (template, data, form) => {
        const html = template(data);

        console.log("Data from generator: " + JSON.stringify(data, null, 2));

        try {
            const { uri } = await Print.printToFileAsync({ html });
            console.log('File has been saved to:', uri);
            await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });

            if(form !== null) {

                const reportData = await reportService.Add(form);
                console.log('Report data: ', reportData);

                const pdfBlob = await fetch(uri).then((res) => res.blob());

                const formData = new FormData();

                formData.append('file', {
                    uri: uri,
                    type: 'application/pdf',
                    name: `report-${reportData.data.reportId}.pdf`,
                });

                const response = await reportService.UploadFile(reportData.data.reportId, formData);
            }

        } catch (error) {
            console.error('Error creating PDF:', error);
        }
    }


}

export default ReportGenerator;
