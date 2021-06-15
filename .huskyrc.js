const huskyConfig = {
    "hooks": {
        "pre-commit": "./bin/pre-commit.sh",
        "pre-push": "./bin/pre-push.sh",
    }
  };
  
  module.exports = huskyConfig;