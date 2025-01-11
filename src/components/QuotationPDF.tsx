import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import type { Project } from '../types';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  companyInfo: {
    marginBottom: 20,
  },
  propertyInfo: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  propertyDetails: {
    marginTop: 10,
    fontSize: 10,
    color: '#666',
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  col1: { width: '50%' },
  col2: { width: '25%' },
  col3: { width: '25%', textAlign: 'right' },
  total: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#000',
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#666',
    fontSize: 10,
  },
});

interface ProjectPDFProps {
  project: Project;
}

const ProjectPDF: React.FC<ProjectPDFProps> = ({ project }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>MRQZ REMODELING LLC</Text>
        <View style={styles.companyInfo}>
          <Text>Denver, Colorado 80210</Text>
          <Text>Tel: (720) 736-9728</Text>
          <Text>Email: robmarq47@gmail.com</Text>
        </View>
      </View>

      <View style={styles.propertyInfo}>
        <Text>Propiedad: {project.propertyName}</Text>
        <Text>Unidad: {project.unitNumber}</Text>
        <Text>Tipo: {project.unitType}</Text>
        <Text>Fecha: {project.date}</Text>
        <View style={styles.propertyDetails}>
          <Text>Pies Cuadrados: {project.squareFeet}</Text>
          <Text>Habitaciones: {project.bedrooms}</Text>
          <Text>Baños: {project.bathrooms}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.col1}>Descripción</Text>
          <Text style={styles.col2}>Cantidad</Text>
          <Text style={styles.col3}>Precio</Text>
        </View>

        {project.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.col1}>{item.name}</Text>
            <Text style={styles.col2}>
              {item.multiplier ? `X${item.multiplier}` : '1'}
            </Text>
            <Text style={styles.col3}>
              ${item.price.toLocaleString('en-US')}
            </Text>
          </View>
        ))}

        <View style={styles.total}>
          <Text>Total: ${project.total.toLocaleString('en-US')}</Text>
        </View>
      </View>

      {project.notes && (
        <View style={{ marginTop: 20, padding: 10, borderTop: 1, borderColor: '#eee' }}>
          <Text style={{ fontSize: 10, color: '#666' }}>Notas:</Text>
          <Text style={{ marginTop: 5, fontSize: 10 }}>{project.notes}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text>www.mrqzremodeling.com</Text>
      </View>
    </Page>
  </Document>
);

export default ProjectPDF;