import * as Print from 'expo-print';
import {shareAsync} from 'expo-sharing';
import reportService from "../dataServices/reportService";
import ReportDto from "../../data/DTOs/reportDto";
import crudService from "../dataServices/crudService";
class ReportGenerator {

    static printToFile = async (template, data, form=null) => {
        const html = template(data);

        try {
            const { uri } = await Print.printToFileAsync({ html });
            await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });

            if(form !== null) {
                const reportDto = new ReportDto(data);
                const reportData = await crudService.Post(reportDto, "Report")
                const formData = new FormData();

                formData.append('file', {
                    uri: uri,
                    type: 'application/pdf',
                    name: `report-${reportData.data.reportId}.pdf`,
                });

                await reportService.UploadFile(reportData.data.reportId, formData);
            }

        } catch (error) {
            throw error;
        }
    }
}

export default ReportGenerator;
