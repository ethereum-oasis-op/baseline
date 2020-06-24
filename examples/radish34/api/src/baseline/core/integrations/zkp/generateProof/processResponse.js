export default (job, done) => {
  try {
    done(null, job.data);
  } catch (error) {
    console.error('Error', error);
  }
};
