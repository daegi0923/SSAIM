package com.e203.document.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.e203.document.service.ErdService;
import com.e203.jwt.JWTUtil;

import lombok.RequiredArgsConstructor;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequiredArgsConstructor
public class ErdController {

	private final JWTUtil jwtUtil;
	private final ErdService erdService;

	@PostMapping("/api/v1/projects/{projectId}/ERD")
	public ResponseEntity<String> createErd(@PathVariable Integer projectId,
		@RequestPart(name = "ErdImage", required = false) MultipartFile image,
		@RequestHeader("Authorization") String auth) {

		int userId = jwtUtil.getUserId(auth.substring(7));
		String result = erdService.createErd(projectId, userId, image);

		return switch (result) {
			case "Not found" -> ResponseEntity.status(404).body("Project를 찾을 수 없습니다.");
			case "Not authorized" -> ResponseEntity.status(403).body("권한이 없습니다.");
			case "success" -> ResponseEntity.status(200).body("ERD 생성에 완료되었습니다.");
			case "fail" -> ResponseEntity.status(404).body("ERD 생성에 실패했습니다.");
			default ->  ResponseEntity.status(200).body("생성이 완료되었습니다.");
		};
	}

	@PatchMapping("/api/v1/projects/{projectId}/ERD")
	public ResponseEntity<String> updateErd(@PathVariable Integer projectId,
		@RequestPart(name = "ErdImage", required = false) MultipartFile image,
		@RequestHeader("Authorization") String auth) {
		int userId = jwtUtil.getUserId(auth.substring(7));
		String result = erdService.updateErd(projectId, userId, image);

		return switch (result) {
			case "Project not found" -> ResponseEntity.status(NOT_FOUND).body("Project를 찾을 수 없습니다.");
			case "Not authorized" -> ResponseEntity.status(UNAUTHORIZED).body("권한이 없습니다.");
			case "ERD not found" -> ResponseEntity.status(NOT_FOUND).body("ERD 찾을 수 없습니다.");
			case "success" -> ResponseEntity.status(OK).body("ERD 수정이 완료되었습니다.");
			case "fail" -> ResponseEntity.status(NOT_FOUND).body("ERD 수정에 실패했습니다.");
			default ->  ResponseEntity.status(OK).body("수정이 완료되었습니다.");
		};
	}

	@GetMapping("/api/v1/projects/{projectId}/ERD")
	public ResponseEntity<String> findErd(@PathVariable Integer projectId,
		@RequestHeader("Authorization") String auth) {
		int userId = jwtUtil.getUserId(auth.substring(7));
		String result = erdService.findErd(projectId, userId);

		return switch (result) {
			case "Not found" -> ResponseEntity.status(404).body("Project를 찾을 수 없습니다.");
			case "Not authorized" -> ResponseEntity.status(403).body("권한이 없습니다.");
			case "fail" -> ResponseEntity.status(404).body("ERD 생성에 실패했습니다.");
			default ->  ResponseEntity.status(200).body("생성이 완료되었습니다.");
		};
	}
}

