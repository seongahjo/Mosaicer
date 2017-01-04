import tensorflow as tf

FLAGS = tf.app.flags.FLAGS

# compare
tf.app.flags.DEFINE_integer('num_examples',1,
                           """Number of examples to run.""")
tf.app.flags.DEFINE_integer('input_size',24,"""INPUT SIZE""")
tf.app.flags.DEFINE_integer('label_size',2,"""Label size""")


# core
# Basic model parameters.
tf.app.flags.DEFINE_integer('batch_size', 128,
                            """Number of images to process in a batch.""")

tf.app.flags.DEFINE_boolean('use_fp16', False,
                            """Train the model using fp16.""")


# input
tf.app.flags.DEFINE_integer('num_classes',10,
                           """Number of classes to run.""")

# train
tf.app.flags.DEFINE_integer('max_steps', 100,
                            """Number of batches to run.""")
tf.app.flags.DEFINE_boolean('log_device_placement', False,
                            """Whether to log device placement.""")


#directory
tf.app.flags.DEFINE_string('image_dir', '/tmp/seongah_image',
                           """Path to the image data directory.""")
tf.app.flags.DEFINE_string('data_dir', '/tmp/seongah_data',
                           """Path to the binary data directory.""")
tf.app.flags.DEFINE_string('train_dir', '/tmp/seongah_train',
                           """Path to the train data directory.""")
tf.app.flags.DEFINE_string('temp_dir', '/tmp/seongah_temp',
                           """Path to the temp data directory.""")
tf.app.flags.DEFINE_string('video_dir', '/tmp/seongah_video',
                           """Path to the video data directory.""")
