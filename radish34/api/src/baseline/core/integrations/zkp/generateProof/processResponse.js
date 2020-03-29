export default (job, done) => {
  try {
    const { data } = job;
    done(null, data);
  } catch (error) {
    console.error('Error', error);
  }
};
