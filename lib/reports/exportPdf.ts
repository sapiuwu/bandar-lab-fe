// lib/reports/exportPdf.ts
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 11 },
  header: { fontSize: 18, marginBottom: 20 },
  section: { margin: 10, padding: 10 },
});

export const ReportPDF = ({ report }: { report: ReportData }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.header}>
        <Text>{report.symbol} • Investment Report</Text>
      </View>
      {/* Add sections */}
    </Page>
  </Document>
);