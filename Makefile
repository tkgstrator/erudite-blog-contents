.PHONY: build
build:
	act --verbose --job notify --eventpath .github/push.json --secret-file .secrets --platform ubuntu-24.04=catthehacker/ubuntu:act-22.04

.PHONY: frontmatter
frontmatter:
	act --verbose --job frontmatter --eventpath .github/push.json --secret-file .secrets --platform ubuntu-24.04=catthehacker/ubuntu:act-22.04
