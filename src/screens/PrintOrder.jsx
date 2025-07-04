import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert, Modal, Dimensions } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Pdf from 'react-native-pdf';

const { width, height } = Dimensions.get('window');

const PrintOrder = ({ orderData }) => {
    const [downloading, setDownloading] = useState(false);
    const [pdfSource, setPdfSource] = useState(null);
    const [showPdfModal, setShowPdfModal] = useState(false);

    const generateAndShowPDF = async () => {
        setDownloading(true);
        try {
            console.log("Before API call-- FroNET");
            const apiUrl = 'http://10.190.129.33:4000/generate-invoice';

            // Get PDF data without saving to downloads
            const response = await ReactNativeBlobUtil
                .config({ fileCache: true })
                .fetch('POST', apiUrl, {
                    'Content-Type': 'application/json',
                }, JSON.stringify(orderData));

            if (response.info().status === 200) {
                // Set PDF source to display in modal
                setPdfSource({
                    uri: `file://${response.path()}`,
                    cache: true
                });
                setShowPdfModal(true);
                Alert.alert('Success', 'Invoice generated successfully!');
            } else {
                throw new Error('Failed to generate invoice');
            }

        } catch (error) {
            console.error('Generate error:', error);
            Alert.alert('Error', 'Failed to generate invoice. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    const downloadPDF = async () => {
        if (!pdfSource) return;

        try {
            const { config, fs } = ReactNativeBlobUtil;
            const downloads = fs.dirs.DownloadDir;
            const fileName = `invoice_${orderData.orderId}_${Date.now()}.pdf`;

            // Copy the cached file to downloads
            await fs.cp(pdfSource.uri.replace('file://', ''), `${downloads}/${fileName}`);

            Alert.alert('Success', 'Invoice downloaded to Downloads folder!');
        } catch (error) {
            console.error('Download error:', error);
            Alert.alert('Error', 'Failed to download invoice.');
        }
    };

    const closePdfModal = () => {
        setShowPdfModal(false);
        setPdfSource(null);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, downloading && styles.buttonDisabled]}
                onPress={generateAndShowPDF}
                disabled={downloading}
            >
                <Text style={styles.buttonText}>
                    {downloading ? 'Generating PDF...' : 'View Invoice'}
                </Text>
            </TouchableOpacity>

            {/* PDF Modal */}
            <Modal
                visible={showPdfModal}
                animationType="slide"
                onRequestClose={closePdfModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Invoice PDF</Text>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={styles.downloadButton}
                                onPress={downloadPDF}
                            >
                                <Text style={styles.buttonText}>Download</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={closePdfModal}
                            >
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {pdfSource && (
                        <Pdf
                            source={pdfSource}
                            style={styles.pdf}
                            onLoadComplete={(numberOfPages) => {
                                console.log(`PDF loaded with ${numberOfPages} pages`);
                            }}
                            onPageChanged={(page) => {
                                console.log(`Current page: ${page}`);
                            }}
                            onError={(error) => {
                                console.error('PDF Error:', error);
                                Alert.alert('Error', 'Failed to load PDF');
                            }}
                        />
                    )}
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f8f9fa',
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
    },
    downloadButton: {
        backgroundColor: '#28a745',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    closeButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    pdf: {
        flex: 1,
        width: width,
        height: height,
    },
});

export default PrintOrder;