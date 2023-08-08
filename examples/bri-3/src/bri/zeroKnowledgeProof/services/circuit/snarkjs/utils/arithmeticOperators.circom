template Add(n) {
    signal input nums[n];
    signal output result;

    signal sums[n];
    sums[0] <== nums[0];

    for (var i=1; i < n; i++) {
        sums[i] <== sums[i - 1] + nums[i];
    }

    result <== sums[n - 1];
}

template Mul(n) {
    signal input nums[n];
    signal output result;

    signal muls[n];
    muls[0] <== nums[0];

    for (var i=1; i < n; i++) {
        muls[i] <== muls[i - 1] * muls[i];
    }

    result <== muls[n - 1];
}