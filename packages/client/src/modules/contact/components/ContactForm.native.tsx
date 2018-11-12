import React from 'react';
import { FormikProps, withFormik } from 'formik';
import { Keyboard, View, StyleSheet, Text } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import Field from '../../../utils/FieldAdapter';
import { RenderField, FormView, Button, Modal, danger, success } from '../../common/components/native';
import { placeholderColor, submit } from '../../common/components/native/styles';
import { contactFormSchema } from '../../../../../server/src/modules/contact/contactFormSchema';
import { validate } from '../../../../../common/modules/validation';
import { transformValidationMessagesFromGraphql } from '../../../../../common/utils';
import { TranslateFunction } from '../../../i18n';
import { ContactForm } from '../types';

interface ContactFormProps {
  t: TranslateFunction;
  onSubmit: (values: ContactForm) => Promise<{ errors: Array<{ field: string; message: string }> }>;
}

const ContactForm = ({
  values,
  handleSubmit,
  t,
  errors,
  status,
  setStatus
}: FormikProps<ContactForm> & ContactFormProps) => (
  <FormView contentContainerStyle={{ flexGrow: 1 }} style={styles.formView}>
    <Modal isVisible={status && status.showModal} onBackdropPress={setStatus}>
      <View style={styles.modal}>
        <Text style={styles.modalText}>{status && status.serverError ? status.serverError : t('successMsg')}</Text>
        <Button type={status.serverError ? danger : success} onPress={setStatus}>
          {t('modal.btnMsg')}
        </Button>
      </View>
    </Modal>
    <View style={styles.formContainer}>
      <View>
        <Field
          name="name"
          component={RenderField}
          type="text"
          placeholder={t('form.field.name')}
          value={values.name}
          placeholderTextColor={placeholderColor}
        />
        <Field
          name="email"
          component={RenderField}
          type="text"
          placeholder={t('form.field.email')}
          value={values.email}
          keyboardType="email-address"
          placeholderTextColor={placeholderColor}
        />
        <Field
          name="content"
          component={RenderField}
          type="textarea"
          placeholder={t('form.field.content')}
          value={values.content}
          placeholderTextColor={placeholderColor}
        />
      </View>
      <View style={styles.submit}>
        <Button onPress={handleSubmit}>{t('form.btnSubmit')}</Button>
      </View>
    </View>
    <KeyboardSpacer />
  </FormView>
);

const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 15,
    flex: 1,
    justifyContent: 'center'
  },
  modal: {
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    padding: 15
  },
  modalText: {
    textAlign: 'center',
    paddingBottom: 15
  },
  formView: {
    flex: 1,
    alignSelf: 'stretch'
  },
  submit
});

const ContactFormWithFormik = withFormik<ContactFormProps, ContactForm>({
  mapPropsToValues: () => ({ content: '', email: '', name: '' }),
  async handleSubmit(values, { resetForm, setErrors, setStatus, props: { onSubmit } }) {
    Keyboard.dismiss();

    const { errors } = await onSubmit(values);
    if (errors) {
      setErrors(transformValidationMessagesFromGraphql(errors));
    } else {
      setStatus({ showModal: true });
      resetForm();
    }
  },
  validate: values => validate(values, contactFormSchema),
  displayName: 'ContactUsForm' // helps with React DevTools
});

export default ContactFormWithFormik(ContactForm);