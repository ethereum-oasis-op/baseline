//
export default (job, done) => {
  try {
    // Update Baseline to say that it's in motion
    done(null, { message: 'Acknowledge done', jobData: job.data });
  } catch (error) {
    console.error('Error', error);
  }
};
