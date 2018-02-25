import tensorflow as tf
tf.app.flags.DEFINE_string('prefix_dir','\\tmp\\',"""Directory Prefix""")
tf.app.flags.DEFINE_string('image_dir', 'image', """Path to folders of labeled images.""")
tf.app.flags.DEFINE_string('output_graph', 'output_graph.pb', """Where to save the trained graph.""")
tf.app.flags.DEFINE_string('summaries_dir', 'retrain_logs', """Where to save summary logs for TensorBoard.""")
tf.app.flags.DEFINE_string('intermediate_output_graphs_dir', 'intermediate_graph',
                           """Where to save the intermediate graphs.""")
tf.app.flags.DEFINE_string('model_dir', 'imagenet', """\
      Path to classify_image_graph_def.pb,
      imagenet_synset_to_human_label_map.txt, and
      imagenet_2012_challenge_label_map_proto.pbtxt.\
      """)
tf.app.flags.DEFINE_string('bottleneck_dir', 'bottleneck', """Path to cache bottlenectk layer values as files.""")

tf.app.flags.DEFINE_integer('intermediate_store_frequency', 0,
                            """How many steps to store intermediate graph. If "0" then will not store""")
tf.app.flags.DEFINE_string('output_labels', 'output_labels.txt', """Where to save the trained graph\'s labels.""")
tf.app.flags.DEFINE_integer('how_many_training_steps', 200, """How many training steps to run before ending.""")
tf.app.flags.DEFINE_float('learning_rate', 0.01, """How large a learning rate to use when training.""")
tf.app.flags.DEFINE_integer('testing_percentage', 10, """What percentage of images to use as a test set.""")
tf.app.flags.DEFINE_integer('validation_percentage', 10, """What percentage of images to use as a validation set.""")
tf.app.flags.DEFINE_integer('eval_step_interval', 10, """How often to evaluate the training results.""")
tf.app.flags.DEFINE_integer('train_batch_size', 10, """How many images to train on at a time.""")
tf.app.flags.DEFINE_integer('test_batch_size', -1, """\
      How many images to test on. This test set is only used once, to evaluate
      the final accuracy of the model after training completes.
      A value of -1 causes the entire test set to be used, which leads to more
      stable results across runs.\
""")
tf.app.flags.DEFINE_integer('validation_batch_size', 10, """\
      How many images to use in an evaluation batch. This validation set is
      used much more often than the test set, and is an early indicator of how
      accurate the model is during training.
      A value of -1 causes the entire validation set to be used, which leads to
      more stable results across training iterations, but may be slower on large
      training sets.\
      """)
tf.app.flags.DEFINE_boolean('print_misclassified_test_images', False, """\
Whether to print out a list of all misclassified test images. \
""")

tf.app.flags.DEFINE_string('final_tensor_name', 'final_result',
                           """The name of the output classification layer in the retrained graph.""")
tf.app.flags.DEFINE_boolean('flip_left_right', False,
                            """Whether to randomly flip half of the training images horizontally.""")
tf.app.flags.DEFINE_integer('random_crop', 0, """"\
      A percentage determining how much of a margin to randomly crop off the
      training images.\
      """)
tf.app.flags.DEFINE_integer('random_scale', 0, """\
      A percentage determining how much to randomly scale up the size of the
      training images by.\
      """)
tf.app.flags.DEFINE_integer('random_brightness', 0, """\
      A percentage determining how much to randomly multiply the training image
      input pixels up or down by.\
      """)

tf.app.flags.DEFINE_string('architecture', 'inception_v3', """\
      Which model architecture to use. 'inception_v3' is the most accurate, but
      also the slowest. For faster or smaller models, chose a MobileNet with the
      form 'mobilenet_<parameter size>_<input_size>[_quantized]'. For example,
      'mobilenet_1.0_224' will pick a model that is 17 MB in size and takes 224
      pixel input images, while 'mobilenet_0.25_128_quantized' will choose a much
      less accurate, but smaller and faster network that's 920 KB on disk and
      takes 128x128 images. See https://research.googleblog.com/2017/06/mobilenets-open-source-models-for.html
      for more information on Mobilenet.\
      """)
