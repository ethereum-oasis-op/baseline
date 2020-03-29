//
export default (job, done) => {
  try {
    const { data } = job;
    // Update Baseline to say that it's in motion
    done(null, { message: 'Acknowledge done', jobData: data });
  } catch (error) {
    console.error('Error', error);
  }
};
