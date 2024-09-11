import { ValidationError } from 'class-validator';

export class ValidationUtilities {
  public static formatErrors(errors: ValidationError[]): string[] {
    const processError = (err: ValidationError, parentPath: string = ''): string[] => {
      const propertyPath = parentPath ? `${parentPath}.${err.property}` : err.property;

      const currentError = err.constraints ? [`property: ${propertyPath} errors: ${Object.values(err.constraints).join(', ')}`] : [];

      const childErrors = err.children ? err.children.flatMap((child) => processError(child, propertyPath)) : [];

      return [...currentError, ...childErrors];
    };

    return errors.flatMap((err) => processError(err));
  }
}
