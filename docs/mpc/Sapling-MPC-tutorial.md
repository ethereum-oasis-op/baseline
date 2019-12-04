## Background
Groth16 is a non-interactive zero knowledge proof system with a very small proof size. This makes it ideal for enabling private transactions on Ethereum. Unfortunately, both the  succinctness and the non-interactivity of this proof is made possible through the use of a common reference string. While the CRS itself is public, some of the components used to construct the CRS must remain hidden from both the prover and the verifier.

A common reference string is constructed by taking some function and evaluating that function on some random input. While the evaluation of the function on this input will be known to all parties, it is very important that the input to this function is not known. If the input to this function is known, then somebody would be able to forge a proof (and prove that they are in possession of a value that they do not actually have possession of). The random input is often referred to as toxic waste.

Because the random input must remain hidden, there are two options for generating a CRS. One option is to use a trusted third party. A more ideal option is to use a multi-party computation protocol. An MPC allows a group of people to construct the CRS using many different random integers. Each person will know exactly one of these random integers. Despite the fact that nobody knows any other pieces of randomness besides their own, the group will be able to collectively evaluate the CRS circuit on an aggregation of the different random integers.

In the Sapling MPC, the Groth CRS is reorganized into a few different pieces. Some of these pieces are dependent on the circuit and some of them aren't. This is very convenient because it enables the MPC to be run in two phases. The first phase calculates the piecess that are independent of the circuit. It only has to be run once, and can then be reused for all circuits. Phase 1 of the protocol was already run, and so the necessary paramaters exist. The second phase is circuit specific. Phase2 will be run instead of the existing setup phase. It will need access to the paramaters from the first phase of the ceremony. 

## Coding the Setup Ceremony

The following code makes use of a Rust crate called Phase2, written by ZCash. 

After a circuit is created, we first create the initial paramaters for the CRS that will be associated with this circuit. 

```rust    
phase2::MPCParameters::new(my_circuit).unwrap().write(&mut params).unwrap();
```

This writes the initial parameters to a file called params. The next step in the  MPC protocol is to send this file to somebody else. Once they recieve the file, they would do the following:

```rust
    let current_params = File::open("params").expect("couldn't open `./params`");
    let mut current_params = BufReader::with_capacity(1024*1024, current_params);

    let new_params = File::create("new_params").expect("couldn't create `./new_params`");
    let mut new_params = BufWriter::with_capacity(1024*1024, new_params);

    let mut my_circuit = phase2::MPCParameters::read(&mut current_params, false)
        .expect("couldn't deserialize Sapling Spend params");

    let rng = &mut rand::OsRng::new().expect("couldn't create RNG");
     
    my_circuit.contribute(rng);
    
    my_circuit.write(&mut new_params).expect("couldn't write new Sapling Spend params");
```
The above code reads the params file that the initial paramters were written to. It generates a random number. Then, it re-evaluates the CRS circuit on this random number through the ``contribute`` function. It writes the new parameters (the re-evaluated CRS) to the file new_params. Now the person who ran this code can send new_params back to the ceremony coordinator. The coordinator will send this file to somebody else and the process will repeat. 

When all participants have contrbuted their randomness to the CRS, the ceremony coordinator will run a random beacon. A random beacon is a function that spits out randomness after a pre-sepcified amount of time. The time lag makes it impossible for any of the participants to change their output based on the random beacon's output. The ceremony coordinator would run the following:

```rust
    let rng = &mut {
        use byteorder::{ReadBytesExt, BigEndian};
        use rand::{SeedableRng};
        use rand::chacha::ChaChaRng;

        // Place beacon value here (2^42 SHA256 hash of Bitcoin block hash #534861)
        let beacon_value: [u8; 32] = hex!("2bf41a959668e5b9b688e58d613b3dcc99ee159a880cf764ec67e6488d8b8af3");

        print!("Final result of beacon: ");
        for b in beacon_value.iter() {
            print!("{:02x}", b);
        }
        println!("");

        let mut digest = &beacon_value[..];

        let mut seed = [0u32; 8];
        for i in 0..8 {
            seed[i] = digest.read_u32::<BigEndian>().expect("digest is large enough for this to work");
        }

        ChaChaRng::from_seed(&seed)
    };  
```

The above code uses a random beacon to generate a randoom number. After this is done, the coordinator can now contribute this value to the CRS paramaters by running `my_circuit.contribute(rng)`. 

This concludes the MPC ceremony. The CRS has now been generated and can be used to create the prover key and the verification key.  
