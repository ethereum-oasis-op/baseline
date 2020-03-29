export default (job, done) => {
  try {
    const { data } = job;
    done(null, { message: 'API: Process Response', jobData: data });
  } catch (error) {
    console.error('Error', error);
  }
};
