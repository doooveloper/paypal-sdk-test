export default (key: string): string => {
  const mandatoryConfigValue = process.env[key];
  if (!mandatoryConfigValue) throw new Error(`${key} is required`);
  
  return mandatoryConfigValue;
}