export default (job, done) => {
  try {
    done(null, { message: 'API: Process Response', jobData: job.data });
  } catch (error) {
    console.error('Error', error);
  }
};
